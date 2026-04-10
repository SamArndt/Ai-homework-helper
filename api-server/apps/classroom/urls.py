from django.urls import path, include
from .views import ClassesView, EnrolledView, StaffView, ReportView, DashboardView, ClassroomsView, ClassroomDetailView, ClassroomMembershipDetailView, ClassroomAssignmentListView, ClassroomAssignmentDetailView, ClassroomReportListView, ClassroomReportDetailView, ReportListView, ReportDetailView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),

    # GET: summary for the authenticated user
    # Includes:
    #   - classrooms the user is enrolled in
    #   - student reports the user has generated and/or can view
    #   - staff-facing reports the user can access
    # Query params:
    #   - classroom_id (optional): limit dashboard data to one classroom
    #   - role (optional): filter classroom summaries by acting role
    #   - limit (optional): cap number of recent reports returned
    path('dashboard/', DashboardView.as_view(), name='classroom-dashboard'),

    # GET: list classrooms visible to the authenticated user
    # Query params:
    #   - role (optional): student, teacher, observer, superuser
    #   - year (optional)
    #   - timeframe (optional)
    #   - search (optional): match identifier or name
    #
    # POST: create a classroom
    # Body params:
    #   - identifier (required)
    #   - name (required)
    #   - timeframe (optional)
    #   - year (optional)
    path('classrooms/', ClassroomsView.as_view(), name="classroom-list"),

    # GET: retrieve one classroom
    #
    # PATCH: update classroom metadata
    # Body params:
    #   - identifier (optional)
    #   - name (optional)
    #   - timeframe (optional)
    #   - year (optional)
    #
    # DELETE: delete or archive a classroom if allowed
    path('classrooms/<int:classroom_id>/', ClassroomDetailView.as_view(), name="classroom-detail"),

    # GET: retrieve one user's membership in a classroom
    #
    # PATCH: update one user's role override in a classroom
    # Body params:
    #   - role_override: observer, student, teacher, superuser, or null
    #   - null removes the override and falls back to global role
    #
    # DELETE: remove one user from a classroom
    path('classrooms/<int:classroom_id>/memberships/<int:user_id>/', ClassroomMembershipDetailView.as_view(), name='classroom-membership-detail'),

    # GET: list assignments associated with a classroom
    # Query params:
    #   - created_by (optional)
    #   - assigned_after (optional)
    #   - assigned_before (optional)
    #
    # POST: associate an existing assignment with a classroom
    # Body params:
    #   - assignment_id (required)
    path('classrooms/<int:classroom_id>/assignments/', ClassroomAssignmentListView.as_view(), name='classroom-assignment-list'),

    # GET: retrieve one classroom-assignment association
    # Can include assignment details plus classroom-specific metadata like assigned_at
    #
    # DELETE: remove an assignment from a classroom
    # Query params:
    #   - delete_reports (optional, default false): if true, also delete reports tied to this classroom-assignment pair
    path('classrooms/<int:classroom_id>/assignments/<int:assignment_id>/', ClassroomAssignmentDetailView.as_view(), name='classroom-assignment-detail'),

    # GET: list reports associated with a classroom
    # Query params:
    #   - student_id (optional)
    #   - assignment_id (optional)
    #   - created_by_me (optional): true/false if that concept exists in your report generation flow
    #   - limit (optional)
    #
    # POST: create or attach a new report for this classroom
    # Body params:
    #   - student_id (required)
    #   - assignment_id (optional)
    #   - problem_ids (optional)
    #   - report payload fields as needed by your generator/storage flow
    path('classrooms/<int:classroom_id>/reports/', ClassroomReportListView.as_view(), name='classroom-report-list'),

    # GET: retrieve one report associated with a classroom
    #
    # PATCH: update mutable report fields if allowed
    # Body params:
    #   - whichever report fields are editable in your app
    #
    # DELETE: delete a classroom-scoped report if allowed
    path('classrooms/<int:classroom_id>/reports/<int:report_id>/', ClassroomReportDetailView.as_view(), name='classroom-report-detail'),

    # GET: list reports visible to the authenticated user across all classrooms and standalone contexts
    # Query params:
    #   - student_id (optional)
    #   - classroom_id (optional)
    #   - assignment_id (optional)
    #   - limit (optional)
    path('reports/', ReportListView.as_view(), name='report-list'),

    # GET: retrieve one report by id
    #
    # PATCH: update mutable report fields if allowed
    # Body params:
    #   - editable report fields only
    #
    # DELETE: delete a report if allowed
    path('reports/<int:report_id>/', ReportDetailView.as_view(), name='report-detail'),

    # GET: list problem-attempt records for one report
    # Query params:
    #   - problem_id (optional)
    #   - is_correct (optional)
    #
    # POST: add a problem-attempt record to a report
    # Body params:
    #   - problem_id (required)
    #   - hints_used (optional)
    #   - response_data (optional)
    #   - is_correct (optional)
    #   - attempt_number (optional)
    path('reports/<int:report_id>/problems/', ReportProblemListView.as_view(), name='report-problem-list'),

    # GET: retrieve one problem-attempt record for a report
    #
    # PATCH: update one problem-attempt record
    # Body params:
    #   - hints_used (optional)
    #   - response_data (optional)
    #   - is_correct (optional)
    #   - attempt_number (optional)
    #
    # DELETE: delete one problem-attempt record if allowed
    path('reports/<int:report_id>/problems/<int:report_problem_id>/', ReportProblemDetailView.as_view(), name='report-problem-detail'),
]