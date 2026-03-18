from django.db import models

class Institution(models.Model):
    name = models.CharField(max_length=255)
    short_name = models.CharField(max_length=50)
    type = models.CharField(max_length=50, choices=[
        ('UNIVERSITY', 'University'),
        ('POLYTECHNIC', 'Polytechnic'),
        ('COLLEGE_OF_ED', 'College of Education'),
    ])
    location = models.CharField(max_length=255)
    logo_url = models.URLField(max_length=500, blank=True, null=True)
    primary_color = models.CharField(max_length=7, default='#C1B66D')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class College(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='colleges')
    name = models.CharField(max_length=255)
    dean_name = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.institution.short_name}"

class Department(models.Model):
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=255)
    hod_name = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.college.name})"