from apps.ngos.models import NGOProfile
from apps.ngos.services import NGOService

class AdminPanelService:
    @staticmethod
    def approve_ngo(ngo_id):
        return NGOService.update_verification_status(ngo_id, 'approved')

    @staticmethod
    def reject_ngo(ngo_id):
        return NGOService.update_verification_status(ngo_id, 'rejected')
