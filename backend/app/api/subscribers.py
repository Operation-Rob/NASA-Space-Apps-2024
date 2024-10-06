from fastapi import APIRouter, HTTPException, Request, BackgroundTasks, Depends
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import secrets
from sqlalchemy.orm import Session
import smtplib
from email.mime.text import MIMEText

from app.core.config import settings
from app.models.subscriber import Subscriber as SubscriberModel
from app.models.token import Token as TokenModel
from app.db.session import SessionLocal

router = APIRouter()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class Subscriber(BaseModel):
    email: EmailStr
    data: str

# Utility functions
def generate_token(email: str, db: Session) -> str:
    token_str = secrets.token_urlsafe(32)
    expires = datetime.utcnow() + timedelta(hours=24)
    token = TokenModel(token=token_str, email=email, expires=expires)
    db.add(token)
    db.commit()
    db.refresh(token)
    return token_str

def validate_token(token_str: str, db: Session) -> str:
    token = db.query(TokenModel).filter(TokenModel.token == token_str).first()
    if token and token.expires > datetime.utcnow():
        return token.email
    return None

def send_email(to_email: str, subject: str, body: str):
    """Send an email using SMTP."""
    try:
        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        msg = MIMEText(body, 'html')
        msg['From'] = settings.FROM_EMAIL
        msg['To'] = to_email
        msg['Subject'] = subject
        server.sendmail(settings.FROM_EMAIL, to_email, msg.as_string())
        server.quit()
    except Exception as e:
        # Log the error or handle it appropriately
        print(f"Failed to send email to {to_email}: {e}")

# Routes
@router.post("/subscribers")
def subscribe(
    subscriber: Subscriber,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    email = subscriber.email
    data = subscriber.data

    existing_subscriber = db.query(SubscriberModel).filter(SubscriberModel.email == email).first()
    if existing_subscriber and existing_subscriber.active and not existing_subscriber.unsubscribed:
        raise HTTPException(status_code=400, detail="Email already subscribed.")

    if existing_subscriber:
        existing_subscriber.data = data
        existing_subscriber.unsubscribed = False
    else:
        new_subscriber = SubscriberModel(
            email=email,
            data=data,
            active=False,
            unsubscribed=False
        )
        db.add(new_subscriber)
    db.commit()

    token_str = generate_token(email, db)
    confirm_url = f"{request.url_for('confirm_subscription')}?token={token_str}"

    subject = "Confirm your subscription"
    with open("/backend/emails/email_template.html", "r") as file:
        html_template = file.read()

    # Use Python string formatting (or Jinja2) to insert the confirmation URL
    html_content = html_template.replace("{{ confirm_url }}", confirm_url)


    background_tasks.add_task(send_email, email, subject, html_content)

    return {"message": "Confirmation email sent. Please check your inbox."}

@router.get("/confirm")
def confirm_subscription(token: str, db: Session = Depends(get_db)):
    email = validate_token(token, db)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token.")

    subscriber = db.query(SubscriberModel).filter(SubscriberModel.email == email).first()
    if subscriber:
        subscriber.active = True
        db.commit()
        return {"message": "Subscription confirmed. Thank you!"}
    else:
        raise HTTPException(status_code=404, detail="Subscriber not found.")

@router.get("/unsubscribe")
def unsubscribe(token: str, db: Session = Depends(get_db)):
    email = validate_token(token, db)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token.")

    subscriber = db.query(SubscriberModel).filter(SubscriberModel.email == email).first()
    if subscriber:
        subscriber.unsubscribed = True
        db.commit()
        return {"message": "You have been unsubscribed."}
    else:
        raise HTTPException(status_code=404, detail="Subscriber not found.")

def send_updates(db: Session):
    for subscriber in db.query(SubscriberModel).filter(
        SubscriberModel.active == True,
        SubscriberModel.unsubscribed == False
    ).all():
        # Generate unsubscribe token and link
        token_str = generate_token(subscriber.email, db)
        unsubscribe_url = f"https://satsync.org/api/unsubscribe?token={token_str}"

        # Send update email
        subject = "New Landsat Data Update"
        body = f"""
        <p>Hello,</p>
        <p>There is a new update for your subscribed area.</p>
        <p><a href="{unsubscribe_url}">Unsubscribe</a></p>
        """

        send_email(subscriber.email, subject, body)
