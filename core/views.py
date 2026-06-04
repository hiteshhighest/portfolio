from django.shortcuts import render
from django.http import HttpResponse
from .models import ContactMessage

# Create your views here.
def dashboard(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')

        ContactMessage.objects.create(
            name  = name,
            email = email,
            message = message
        )

        return render(request, 'core/index.html', {'success': True})

    return render(request, 'core/index.html')