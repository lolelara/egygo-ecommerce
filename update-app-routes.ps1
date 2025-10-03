# PowerShell script to update App.tsx with new routes

$filePath = "client\App.tsx"
$content = Get-Content $filePath -Raw -Encoding UTF8

# Add new imports after UpdateAffiliatePrefs
$oldImports = @"
import UpdateAffiliatePrefs from "./pages/UpdateAffiliatePrefs";
import { ErrorBoundary } from "./components/ErrorBoundary";
"@

$newImports = @"
import UpdateAffiliatePrefs from "./pages/UpdateAffiliatePrefs";
import AffiliateCoupons from "./pages/AffiliateCoupons";
import DealsPage from "./pages/DealsPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import ShippingPage from "./pages/ShippingPage";
import FAQPage from "./pages/FAQPage";
import AffiliateWithdrawPage from "./pages/AffiliateWithdrawPage";
import AffiliateResourcesPage from "./pages/AffiliateResourcesPage";
import AffiliateSupportPage from "./pages/AffiliateSupportPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import { ErrorBoundary } from "./components/ErrorBoundary";
"@

$content = $content.Replace($oldImports, $newImports)

# Replace /deals route
$content = $content.Replace(
    "                {/* Placeholder routes */}`n                <Route`n                  path=`"/deals`"`n                  element={<PlaceholderPage title=`"Special Deals`" />}`n                />",
    "                {/* Main routes */}`n                <Route path=`"/deals`" element={<DealsPage />} />"
)

# Add /affiliate/coupons route
$content = $content.Replace(
    "              <Route path=`"/affiliate/creatives`" element={<AffiliateCreatives />} />`n              <Route",
    "              <Route path=`"/affiliate/creatives`" element={<AffiliateCreatives />} />`n              <Route path=`"/affiliate/coupons`" element={<AffiliateCoupons />} />`n              <Route"
)

# Replace affiliate routes
$content = $content.Replace(
    'element={<PlaceholderPage title="سحب الأرباح" />}',
    'element={<AffiliateWithdrawPage />}'
)
$content = $content.Replace(
    'element={<PlaceholderPage title="مصادر التسويق" />}',
    'element={<AffiliateResourcesPage />}'
)
$content = $content.Replace(
    'element={<PlaceholderPage title="الدعم الفني" />}',
    'element={<AffiliateSupportPage />}'
)

# Replace admin settings
$content = $content.Replace(
    'element={<PlaceholderPage title="إعدادات النظام" />}',
    'element={<AdminSettingsPage />}'
)

# Replace main pages
$content = $content.Replace(
    'element={<PlaceholderPage title="About Us" />}',
    'element={<AboutPage />}'
)
$content = $content.Replace(
    'element={<PlaceholderPage title="Contact" />}',
    'element={<ContactPage />}'
)
$content = $content.Replace(
    'element={<PlaceholderPage title="Shipping Info" />}',
    'element={<ShippingPage />}'
)
$content = $content.Replace(
    'element={<PlaceholderPage title="FAQ" />}',
    'element={<FAQPage />}'
)

# Simplify multi-line routes to single line for cleaner code
$content = $content.Replace(
    "              <Route`n                path=`"/affiliate/withdraw`"`n                element={<AffiliateWithdrawPage />}`n              />",
    "              <Route path=`"/affiliate/withdraw`" element={<AffiliateWithdrawPage />} />"
)
$content = $content.Replace(
    "              <Route`n                path=`"/affiliate/resources`"`n                element={<AffiliateResourcesPage />}`n              />",
    "              <Route path=`"/affiliate/resources`" element={<AffiliateResourcesPage />} />"
)
$content = $content.Replace(
    "              <Route`n                path=`"/affiliate/support`"`n                element={<AffiliateSupportPage />}`n              />",
    "              <Route path=`"/affiliate/support`" element={<AffiliateSupportPage />} />"
)
$content = $content.Replace(
    "              <Route`n                path=`"/admin/settings`"`n                element={<AdminSettingsPage />}`n              />",
    "              <Route path=`"/admin/settings`" element={<AdminSettingsPage />} />"
)
$content = $content.Replace(
    "              <Route`n                path=`"/about`"`n                element={<AboutPage />}`n              />",
    "              <Route path=`"/about`" element={<AboutPage />} />"
)
$content = $content.Replace(
    "              <Route`n                path=`"/contact`"`n                element={<ContactPage />}`n              />",
    "              <Route path=`"/contact`" element={<ContactPage />} />"
)
$content = $content.Replace(
    "              <Route`n                path=`"/shipping`"`n                element={<ShippingPage />}`n              />",
    "              <Route path=`"/shipping`" element={<ShippingPage />} />"
)
$content = $content.Replace(
    "              <Route path=`"/faq`" element={<FAQPage />} />",
    "              <Route path=`"/faq`" element={<FAQPage />} />"
)

# Write back to file
$content | Set-Content $filePath -Encoding UTF8 -NoNewline

Write-Host "✅ تم تحديث App.tsx بنجاح!" -ForegroundColor Green
