from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings

def dashboard(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')

        # 📩 Email to YOU (receiver)
        send_mail(
            subject=f"New message from {name}",
            message=f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=["yourgmail@gmail.com"],
            fail_silently=False,
        )

        # 📤 Auto-reply to sender
        send_mail(
            subject="Thanks for contacting me",
            message=f"Hi {name},\n\nThanks for your message. I will reply soon.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return render(request, 'core/index.html', {'success': True})

    return render(request, 'core/index.html')