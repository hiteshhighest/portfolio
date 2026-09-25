from django.contrib.sitemaps import Sitemap
from django.urls import reverse

class StaticViewSitemap(Sitemap):
    changefreq = "weekly"
    priority = 1.0
    protocol = "https"

    def items(self):
        # 'home' matches the name we assigned in your core/urls.py
        return ['home']

    def location(self, item):
        return reverse(item)