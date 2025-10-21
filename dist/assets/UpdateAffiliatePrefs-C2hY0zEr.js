import{l as u,r as a,j as e,a_ as p,a0 as x}from"./vendor-react-CCFRLLzk.js";import{a3 as o,C as h,x as j,y as g,h as y,Q as N,R as w,f as C}from"./index-D7NOjX7I.js";import"./vendor-ui-BA32w1ww.js";import"./vendor-query-j_rPqiug.js";import"./vendor-other-CzBBjgu5.js";import"./vendor-animations-CPHPqPXb.js";import"./vendor-appwrite-CuqfvTq9.js";function k(){const d=u(),[i,l]=a.useState(!1),[t,r]=a.useState(null),[n,f]=a.useState(null);a.useEffect(()=>{c()},[]);const c=async()=>{try{const s=await o.get();f(s.prefs)}catch(s){console.error("Error loading prefs:",s)}},m=async()=>{try{l(!0),r(null),await o.updatePrefs({isAffiliate:!0,role:"affiliate",commissionRate:15}),r({type:"success",text:"✅ تم تحديث الإعدادات بنجاح! قم بتحديث الصفحة لرؤية التغييرات."}),await c(),setTimeout(()=>{d("/affiliate/dashboard")},2e3)}catch(s){r({type:"error",text:`❌ خطأ: ${s.message}`})}finally{l(!1)}};return e.jsx("div",{className:"container mx-auto px-4 py-8 max-w-2xl",children:e.jsxs(h,{children:[e.jsx(j,{children:e.jsx(g,{className:"text-2xl",children:"تحديث إعدادات المسوق"})}),e.jsxs(y,{className:"space-y-6",children:[n&&e.jsxs("div",{className:"bg-gray-50 p-4 rounded-lg",children:[e.jsx("h3",{className:"font-semibold mb-2",children:"الإعدادات الحالية:"}),e.jsx("pre",{className:"text-sm overflow-auto",children:JSON.stringify(n,null,2)})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h3",{className:"font-semibold",children:"هذه الصفحة ستقوم بـ:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-sm text-gray-600",children:[e.jsx("li",{children:"تفعيل حساب المسوق (isAffiliate: true)"}),e.jsx("li",{children:'تعيين الدور كـ "affiliate"'}),e.jsx("li",{children:"تعيين نسبة العمولة 15%"})]})]}),t&&e.jsxs(N,{variant:t.type==="error"?"destructive":"default",children:[t.type==="success"?e.jsx(p,{className:"h-4 w-4"}):e.jsx(x,{className:"h-4 w-4"}),e.jsx(w,{children:t.text})]}),e.jsx(C,{onClick:m,disabled:i,className:"w-full",size:"lg",children:i?"جاري التحديث...":"تحديث الإعدادات"}),e.jsxs("div",{className:"border-t pt-4",children:[e.jsx("h3",{className:"font-semibold mb-2",children:"أو استخدم Console المتصفح:"}),e.jsx("div",{className:"bg-black text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto",children:e.jsx("code",{children:`// افتح Console (F12) ونفذ:
import('https://cdn.jsdelivr.net/npm/appwrite@14.0.1').then(async (Appwrite) => {
  const client = new Appwrite.Client()
    .setEndpoint('undefined')
    .setProject('undefined');
  
  const account = new Appwrite.Account(client);
  
  await account.updatePrefs({
    isAffiliate: true,
    role: 'affiliate',
    commissionRate: 15
  });
  
  console.log('✅ تم التحديث!');
  location.reload();
});`})})]})]})]})})}export{k as default};
