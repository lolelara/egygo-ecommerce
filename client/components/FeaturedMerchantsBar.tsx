import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { merchantsApi } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Store } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export function FeaturedMerchantsBar() {
    const [merchants, setMerchants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useI18n();

    useEffect(() => {
        const loadMerchants = async () => {
            try {
                const data = await merchantsApi.getFeatured();
                setMerchants(data);
            } catch (error) {
                console.error('Failed to load featured merchants:', error);
            } finally {
                setLoading(false);
            }
        };

        loadMerchants();
    }, []);

    if (loading || merchants.length === 0) {
        return null;
    }

    return (
        <div className="w-full bg-background py-4 border-b">
            <div className="container px-4 md:px-6">
                <div className="flex items-center gap-2 mb-3">
                    <Store className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">{t('home.featured.merchants')}</h2>
                </div>

                <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex w-max space-x-4 space-x-reverse p-1">
                        {merchants.map((merchant) => (
                            <Link
                                key={merchant.id}
                                to={`/merchant/${merchant.id}`}
                                className="block group"
                            >
                                <Card className="w-[140px] p-3 flex flex-col items-center gap-2 hover:shadow-md transition-shadow cursor-pointer border-muted">
                                    <Avatar className="h-16 w-16 border-2 border-muted group-hover:border-primary transition-colors">
                                        <AvatarImage src={merchant.storeLogo} alt={merchant.name} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                                            {merchant.name.substring(0, 1).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-center w-full">
                                        <p className="text-sm font-medium truncate w-full" title={merchant.name}>
                                            {merchant.name}
                                        </p>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
