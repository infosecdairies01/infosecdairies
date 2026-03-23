from django.db import models

class Certificate(models.Model):
    cert_id = models.CharField(max_length=50, unique=True, primary_key=True)
    student_name = models.CharField(max_length=255)
    course_name = models.CharField(max_length=255)
    issue_date = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'certificates'
    
    def __str__(self):
        return f"{self.student_name} - {self.cert_id}"
