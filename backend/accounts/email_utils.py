"""
Email utilities for sending various types of emails in the clearance system.
"""
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags


def send_email_verification(user_email, verification_token, user_name=""):
    """
    Send email verification link to new users.
    """
    subject = 'Verify Your Email - Student Clearance System'
    verification_link = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #8a7e4f 0%, #a89658 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .button {{ display: inline-block; padding: 15px 30px; background: #8a7e4f; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 30px; font-size: 12px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Email Verification</h1>
            </div>
            <div class="content">
                <p>Hello{' ' + user_name if user_name else ''},</p>
                <p>Thank you for registering with the Student Clearance System. Please verify your email address by clicking the button below:</p>
                <div style="text-align: center;">
                    <a href="{verification_link}" class="button">Verify Email Address</a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #8a7e4f;">{verification_link}</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't create an account, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; 2026 Student Clearance System. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    Email Verification
    
    Hello{' ' + user_name if user_name else ''},
    
    Thank you for registering with the Student Clearance System. Please verify your email address by clicking the link below:
    
    {verification_link}
    
    This link will expire in 24 hours.
    
    If you didn't create an account, please ignore this email.
    
    © 2026 Student Clearance System. All rights reserved.
    """
    
    email = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [user_email])
    email.attach_alternative(html_content, "text/html")
    email.send()


def send_officer_invitation(officer_email, invitation_token, inviter_name=""):
    """
    Send invitation email to new officers.
    """
    subject = 'You\'ve Been Invited - Student Clearance System'
    onboarding_link = f"{settings.FRONTEND_URL}/onboard-officer?token={invitation_token}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #8a7e4f 0%, #a89658 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .button {{ display: inline-block; padding: 15px 30px; background: #8a7e4f; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 30px; font-size: 12px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Officer Invitation</h1>
            </div>
            <div class="content">
                <p>Hello,</p>
                <p>{inviter_name + ' has' if inviter_name else 'You have been'} invited you to join the Student Clearance System as a clearance officer.</p>
                <p>Click the button below to complete your registration:</p>
                <div style="text-align: center;">
                    <a href="{onboarding_link}" class="button">Accept Invitation</a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #8a7e4f;">{onboarding_link}</p>
                <p>This invitation will expire in 7 days.</p>
            </div>
            <div class="footer">
                <p>&copy; 2026 Student Clearance System. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    Officer Invitation
    
    Hello,
    
    {inviter_name + ' has' if inviter_name else 'You have been'} invited you to join the Student Clearance System as a clearance officer.
    
    Click the link below to complete your registration:
    
    {onboarding_link}
    
    This invitation will expire in 7 days.
    
    © 2026 Student Clearance System. All rights reserved.
    """
    
    email = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [officer_email])
    email.attach_alternative(html_content, "text/html")
    email.send()


def send_password_reset_email(user_email, reset_token, user_name=""):
    """
    Send password reset email.
    """
    subject = 'Password Reset Request - Student Clearance System'
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #8a7e4f 0%, #a89658 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .button {{ display: inline-block; padding: 15px 30px; background: #8a7e4f; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 30px; font-size: 12px; color: #666; }}
            .warning {{ background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset</h1>
            </div>
            <div class="content">
                <p>Hello{' ' + user_name if user_name else ''},</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <div style="text-align: center;">
                    <a href="{reset_link}" class="button">Reset Password</a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #8a7e4f;">{reset_link}</p>
                <div class="warning">
                    <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2026 Student Clearance System. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    Password Reset
    
    Hello{' ' + user_name if user_name else ''},
    
    We received a request to reset your password. Click the link below to create a new password:
    
    {reset_link}
    
    This link will expire in 1 hour.
    
    Security Notice: If you didn't request a password reset, please ignore this email or contact support if you have concerns.
    
    © 2026 Student Clearance System. All rights reserved.
    """
    
    email = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [user_email])
    email.attach_alternative(html_content, "text/html")
    email.send()


def send_clearance_notification(user_email, notification_type, message, user_name=""):
    """
    Send general clearance notifications (approval, rejection, etc.).
    """
    subject_map = {
        'approval': 'Clearance Approved ✓',
        'rejection': 'Clearance Update Required',
        'submission': 'Clearance Submitted Successfully',
        'complete': 'Clearance Process Completed! 🎉'
    }
    
    subject = f"{subject_map.get(notification_type, 'Clearance Update')} - Student Clearance System"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #8a7e4f 0%, #a89658 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .button {{ display: inline-block; padding: 15px 30px; background: #8a7e4f; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 30px; font-size: 12px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>{subject_map.get(notification_type, 'Clearance Update')}</h1>
            </div>
            <div class="content">
                <p>Hello{' ' + user_name if user_name else ''},</p>
                <p>{message}</p>
                <div style="text-align: center;">
                    <a href="{settings.FRONTEND_URL}/dashboard" class="button">View Dashboard</a>
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2026 Student Clearance System. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    {subject_map.get(notification_type, 'Clearance Update')}
    
    Hello{' ' + user_name if user_name else ''},
    
    {message}
    
    View your dashboard: {settings.FRONTEND_URL}/dashboard
    
    © 2026 Student Clearance System. All rights reserved.
    """
    
    email = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [user_email])
    email.attach_alternative(html_content, "text/html")
    email.send()
