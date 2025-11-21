import { AdminLayout } from "@/components/AdminLayout";
import MerchantProfileSettings from "@/components/merchant/MerchantProfileSettings";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { Navigate } from "react-router-dom";

export default function MerchantSettings() {
    const { user } = useAuth();

    if (!user?.isMerchant) {
        return <Navigate to="/" replace />;
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">إعدادات المتجر</h2>
                    <p className="text-muted-foreground">
                        تخصيص مظهر متجرك ومعلوماتك العامة
                    </p>
                </div>

                <MerchantProfileSettings />
            </div>
        </AdminLayout>
    );
}
