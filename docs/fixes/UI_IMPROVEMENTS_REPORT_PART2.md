# 📊 تقرير تحسينات واجهة المستخدم - الجزء 2

## صفحات الأدمن (Admin Pages)

### **1. AdminDashboard.tsx - لوحة تحكم الأدمن**

**المشاكل الحالية:**
- ❌ بيانات كثيرة بدون تنظيم
- ❌ عدم وجود أولويات واضحة
- ❌ الرسوم البيانية بسيطة

**التحسينات المقترحة:**
```tsx
<AdminDashboard>
  {/* Quick Stats - الإحصائيات السريعة */}
  <StatsOverview grid={4}>
    <StatCard
      title="إجمالي المبيعات اليوم"
      value="12,450 ج.م"
      change="+18%"
      trend="up"
      icon={DollarSign}
      color="green"
    />
    <StatCard
      title="الطلبات الجديدة"
      value="45"
      badge="5 تحتاج مراجعة"
      icon={ShoppingCart}
      color="blue"
      actionLink="/admin/orders"
    />
    <StatCard
      title="المنتجات قيد المراجعة"
      value="12"
      badge="عاجل"
      icon={Package}
      color="orange"
      actionLink="/admin/product-approval"
    />
    <StatCard
      title="المستخدمين النشطين"
      value="1,234"
      change="+5%"
      icon={Users}
      color="purple"
    />
  </StatsOverview>

  {/* Charts Section */}
  <ChartsSection>
    <SalesChart 
      title="المبيعات - آخر 30 يوم"
      data={salesData}
      height={300}
    />
    <OrdersChart 
      title="الطلبات حسب الحالة"
      type="pie"
      data={ordersData}
    />
  </ChartsSection>

  {/* Alerts & Notifications */}
  <AlertsSection>
    <Alert variant="warning">
      ⚠️ 12 منتج قيد المراجعة - اذهب للمراجعة
    </Alert>
    <Alert variant="error">
      🚨 5 منتجات نفذت من المخزون
    </Alert>
    <Alert variant="info">
      💡 15 حساب تاجر ينتظر الموافقة
    </Alert>
  </AlertsSection>

  {/* Recent Activity */}
  <RecentActivity>
    <ActivityFeed>
      - طلب جديد #12345 - منذ دقيقتين
      - منتج جديد من "محمد أحمد" - منذ 5 دقائق
      - تاجر جديد سجل - منذ 10 دقائق
    </ActivityFeed>
  </RecentActivity>

  {/* Top Merchants */}
  <TopMerchants limit={5}>
    - أفضل 5 تجار من حيث المبيعات
  </TopMerchants>

  {/* Top Affiliates */}
  <TopAffiliates limit={5}>
    - أفضل 5 مسوقين من حيث العمولات
  </TopAffiliates>

  {/* Quick Actions */}
  <QuickActions>
    <Button>إضافة منتج</Button>
    <Button>إضافة كوبون</Button>
    <Button>إرسال إشعار جماعي</Button>
    <Button>عرض التقارير</Button>
  </QuickActions>
</AdminDashboard>
```

**الأولوية:** 🔴 عالية جداً  
**الوقت المقدر:** 6-8 ساعات  
**التأثير:** تحسين إدارة الموقع وسرعة اتخاذ القرارات

---

### **2. AdminProductApproval.tsx - مراجعة المنتجات**

**التحسينات المقترحة:**
```tsx
<ProductApprovalPage>
  {/* Stats Bar */}
  <ApprovalStats>
    <Stat label="قيد المراجعة" value={12} color="orange" />
    <Stat label="تمت الموافقة اليوم" value={8} color="green" />
    <Stat label="مرفوضة" value={3} color="red" />
  </ApprovalStats>

  {/* Filters */}
  <Filters>
    <Filter>الكل</Filter>
    <Filter>قيد المراجعة</Filter>
    <Filter>موافق عليها</Filter>
    <Filter>مرفوضة</Filter>
  </Filters>

  {/* Products Grid/List */}
  <ProductsList>
    {products.map(product => (
      <ProductApprovalCard>
        <ProductImages gallery={product.images} />
        <ProductInfo>
          <Name>{product.name}</Name>
          <Merchant>{product.merchantName}</Merchant>
          <Price>{product.price} ج.م</Price>
          <Stock>{product.stock} وحدة</Stock>
        </ProductInfo>
        
        {/* Video Verification */}
        <VideoPreview 
          src={product.verificationVideo}
          thumbnail={product.videoThumbnail}
        />
        
        {/* Actions */}
        <Actions>
          <Button variant="success" size="lg">
            ✓ الموافقة
          </Button>
          <Button variant="destructive" size="lg">
            ✗ الرفض
          </Button>
          <Button variant="outline">
            عرض التفاصيل
          </Button>
        </Actions>
      </ProductApprovalCard>
    ))}
  </ProductsList>

  {/* Bulk Actions */}
  <BulkActions>
    <Select>{selected.length} منتج محدد</Select>
    <Button>الموافقة على الكل</Button>
    <Button>رفض الكل</Button>
  </BulkActions>
</ProductApprovalPage>
```

**الأولوية:** 🔴 عالية  
**الوقت المقدر:** 4-5 ساعات

---

### **3. AdminOrders.tsx - إدارة الطلبات**

**التحسينات المقترحة:**
```tsx
<AdminOrdersPage>
  {/* Stats */}
  <OrderStats>
    <Stat label="طلبات جديدة" value={15} color="blue" />
    <Stat label="قيد التجهيز" value={23} color="orange" />
    <Stat label="في الشحن" value={18} color="purple" />
    <Stat label="مكتملة" value={156} color="green" />
  </OrderStats>

  {/* Filters & Search */}
  <FiltersBar>
    <SearchBox placeholder="ابحث برقم الطلب، اسم العميل..." />
    <StatusFilter />
    <DateFilter />
    <PaymentFilter />
  </FiltersBar>

  {/* Orders Table - Enhanced */}
  <OrdersTable>
    <Columns>
      - رقم الطلب (قابل للنسخ)
      - العميل (مع صورة)
      - المبلغ (بارز)
      - الحالة (Badge ملون)
      - طريقة الدفع
      - التاريخ
      - الإجراءات
    </Columns>
  </OrdersTable>

  {/* Order Details Modal */}
  <OrderDetailsModal>
    <CustomerInfo />
    <OrderItems />
    <ShippingInfo />
    <PaymentInfo />
    <Timeline>
      - تم الطلب
      - تم التأكيد
      - قيد التجهيز
      - تم الشحن
      - تم التوصيل
    </Timeline>
    <Actions>
      <UpdateStatus />
      <PrintInvoice />
      <SendNotification />
    </Actions>
  </OrderDetailsModal>

  {/* Quick Actions */}
  <QuickActions>
    <Button>طباعة جميع الفواتير</Button>
    <Button>تصدير Excel</Button>
    <Button>إرسال إشعارات</Button>
  </QuickActions>
</AdminOrdersPage>
```

**الأولوية:** 🔴 عالية  
**الوقت المقدر:** 5-6 ساعات

---

### **4. AdminProducts.tsx - إدارة المنتجات**

**التحسينات المقترحة:**
```tsx
<AdminProductsPage>
  {/* Stats */}
  <ProductStats>
    <Stat label="إجمالي المنتجات" value={450} />
    <Stat label="متوفر" value={380} color="green" />
    <Stat label="نفذ" value={45} color="red" />
    <Stat label="غير فعال" value={25} color="gray" />
  </ProductStats>

  {/* Filters & Actions */}
  <ActionsBar>
    <SearchBox />
    <CategoryFilter />
    <StockFilter />
    <StatusFilter />
    <Button variant="primary" size="lg">
      + إضافة منتج جديد
    </Button>
  </ActionsBar>

  {/* Products Grid/Table Toggle */}
  <ViewToggle>
    <IconButton active>Grid</IconButton>
    <IconButton>List</IconButton>
  </ViewToggle>

  {/* Products Display */}
  <ProductsGrid>
    {products.map(product => (
      <ProductCard enhanced>
        <Image />
        <Info>
          <Name>{product.name}</Name>
          <Price>{product.price} ج.م</Price>
          <Stock 
            value={product.stock}
            warning={product.stock < 10}
          />
          <Status badge>{product.status}</Status>
        </Info>
        <QuickActions>
          <Edit />
          <Duplicate />
          <Delete />
          <Toggle active={product.isActive} />
        </QuickActions>
      </ProductCard>
    ))}
  </ProductsGrid>

  {/* Bulk Actions */}
  <BulkActions>
    <Select>تحديد الكل</Select>
    <Button>تفعيل</Button>
    <Button>تعطيل</Button>
    <Button>حذف</Button>
    <Button>تصدير</Button>
  </BulkActions>
</AdminProductsPage>
```

**الأولوية:** 🟡 عالية  
**الوقت المقدر:** 5-6 ساعات

---

### **5. AdminUsers.tsx - إدارة المستخدمين**

**التحسينات المقترحة:**
```tsx
<AdminUsersPage>
  {/* User Stats */}
  <UserStats>
    <Stat label="إجمالي المستخدمين" value={5234} />
    <Stat label="عملاء" value={4500} color="blue" />
    <Stat label="تجار" value={450} color="purple" />
    <Stat label="مسوقين" value={234} color="orange" />
    <Stat label="وسطاء" value={50} color="indigo" />
  </UserStats>

  {/* Filters */}
  <FiltersBar>
    <SearchBox />
    <RoleFilter />
    <StatusFilter />
    <DateFilter />
  </FiltersBar>

  {/* Users Table */}
  <UsersTable>
    <Columns>
      - الصورة + الاسم
      - البريد الإلكتروني
      - الدور (Badge)
      - الحالة
      - تاريخ التسجيل
      - الإجراءات
    </Columns>
  </UsersTable>

  {/* User Details Modal */}
  <UserDetailsModal>
    <UserProfile />
    <UserActivity />
    <UserOrders />
    <UserBalance />
    <Actions>
      <ChangeRole />
      <ChangeStatus />
      <SendNotification />
      <ViewDetails />
    </Actions>
  </UserDetailsModal>
</AdminUsersPage>
```

**الأولوية:** 🟡 عالية  
**الوقت المقدر:** 4-5 ساعات

---

### **6. AdminAnalytics.tsx - التحليلات**

**التحسينات المقترحة:**
```tsx
<AdminAnalyticsPage>
  {/* Date Range Selector */}
  <DateRangePicker>
    - اليوم
    - آخر 7 أيام
    - آخر 30 يوم
    - آخر 90 يوم
    - مخصص
  </DateRangePicker>

  {/* KPIs */}
  <KPICards>
    <KPI
      label="إجمالي المبيعات"
      value="125,450 ج.م"
      change="+15%"
      trend="up"
    />
    <KPI
      label="متوسط قيمة الطلب"
      value="278 ج.م"
      change="+8%"
      trend="up"
    />
    <KPI
      label="معدل التحويل"
      value="3.2%"
      change="-0.5%"
      trend="down"
    />
    <KPI
      label="معدل الاسترجاع"
      value="1.2%"
      change="+0.3%"
      trend="up"
    />
  </KPICards>

  {/* Charts */}
  <ChartsGrid>
    <SalesChart type="area" />
    <OrdersChart type="bar" />
    <CategoryChart type="pie" />
    <GrowthChart type="line" />
  </ChartsGrid>

  {/* Detailed Reports */}
  <ReportsSection>
    <TopProducts />
    <TopCategories />
    <TopMerchants />
    <TopAffiliates />
    <CustomerInsights />
    <TrafficSources />
  </ReportsSection>

  {/* Export */}
  <ExportActions>
    <Button>تصدير PDF</Button>
    <Button>تصدير Excel</Button>
    <Button>طباعة</Button>
  </ExportActions>
</AdminAnalyticsPage>
```

**الأولوية:** 🟢 متوسطة  
**الوقت المقدر:** 6-8 ساعات

---

## صفحات المسوق (Affiliate Pages)

### **7. AffiliateDashboard.tsx - لوحة المسوق**

**تم تغطيته في الجزء 1**

---

### **8. AffiliateAnalytics.tsx - تحليلات المسوق**

**التحسينات المقترحة:**
```tsx
<AffiliateAnalyticsPage>
  {/* Earnings Overview */}
  <EarningsOverview>
    <TotalEarnings>2,450 ج.م</TotalEarnings>
    <PendingEarnings>350 ج.م</PendingEarnings>
    <AvailableForWithdraw>2,100 ج.م</AvailableForWithdraw>
  </EarningsOverview>

  {/* Performance Metrics */}
  <PerformanceMetrics>
    <Metric label="النقرات" value="856" change="+22%" />
    <Metric label="المبيعات" value="24" change="+15%" />
    <Metric label="معدل التحويل" value="2.8%" change="+0.5%" />
    <Metric label="متوسط العمولة" value="102 ج.م" change="+8%" />
  </PerformanceMetrics>

  {/* Charts */}
  <ChartsSection>
    <EarningsChart period="last-30-days" />
    <ClicksChart />
    <ConversionsChart />
  </ChartsSection>

  {/* Top Performing Links */}
  <TopLinks>
    <LinkCard>
      <Product />
      <Stats>
        - نقرات: 234
        - مبيعات: 12
        - عمولة: 450 ج.م
      </Stats>
      <Actions>
        <CopyLink />
        <ShareLink />
      </Actions>
    </LinkCard>
  </TopLinks>

  {/* Recent Referrals */}
  <RecentReferrals limit={10} />
</AffiliateAnalyticsPage>
```

**الأولوية:** 🟡 عالية  
**الوقت المقدر:** 4-5 ساعات

---

### **9. AffiliateWithdrawPage.tsx - سحب الأرباح**

**التحسينات المقترحة:**
```tsx
<WithdrawPage>
  {/* Balance Card */}
  <BalanceCard>
    <Available>2,100 ج.م</Available>
    <Pending>350 ج.م</Pending>
    <MinimumWithdraw>100 ج.م</MinimumWithdraw>
  </BalanceCard>

  {/* Withdraw Form */}
  <WithdrawForm>
    <AmountInput 
      max={2100}
      min={100}
      placeholder="أدخل المبلغ"
    />
    
    <PaymentMethod>
      - حوالة بنكية
      - فودافون كاش
      - instapay
    </PaymentMethod>

    <BankDetails>
      - رقم الحساب
      - اسم البنك
      - اسم المستفيد
    </BankDetails>

    <SubmitButton size="lg">
      طلب السحب
    </SubmitButton>
  </WithdrawForm>

  {/* Withdraw History */}
  <WithdrawHistory>
    <Table>
      - التاريخ
      - المبلغ
      - الطريقة
      - الحالة
      - ملاحظات
    </Table>
  </WithdrawHistory>

  {/* FAQs */}
  <WithdrawFAQs>
    - ما هو الحد الأدنى للسحب؟
    - متى يتم تحويل المبلغ؟
    - ما هي رسوم السحب؟
  </WithdrawFAQs>
</WithdrawPage>
```

**الأولوية:** 🟡 عالية  
**الوقت المقدر:** 3-4 ساعات

---

### **10. AffiliateLinkManager.tsx - إدارة الروابط**

**التحسينات المقترحة:**
```tsx
<LinkManagerPage>
  {/* Quick Link Generator */}
  <QuickLinkGenerator>
    <ProductSearch placeholder="ابحث عن منتج..." />
    <GenerateButton>إنشاء رابط</GenerateButton>
  </QuickLinkGenerator>

  {/* My Links */}
  <MyLinks>
    <Filters>
      <Filter>الكل</Filter>
      <Filter>الأكثر نقراً</Filter>
      <Filter>الأكثر ربحاً</Filter>
      <Filter>حديثة</Filter>
    </Filters>

    <LinksList>
      {links.map(link => (
        <LinkCard>
          <ProductImage />
          <ProductName />
          <LinkURL copyable />
          <Stats>
            <Clicks>234 نقرة</Clicks>
            <Sales>12 مبيعة</Sales>
            <Earnings>450 ج.م</Earnings>
          </Stats>
          <Actions>
            <Copy />
            <Share social={['facebook', 'twitter', 'whatsapp']} />
            <QRCode />
            <Edit />
            <Delete />
          </Actions>
        </LinkCard>
      ))}
    </LinksList>
  </MyLinks>

  {/* Link Performance */}
  <LinkPerformance>
    <Chart type="bar" data={performanceData} />
  </LinkPerformance>
</LinkManagerPage>
```

**الأولوية:** 🟡 عالية  
**الوقت المقدر:** 4-5 ساعات

---

## صفحات عامة (General Pages)

### **11. Login.tsx / Register.tsx - تسجيل الدخول/إنشاء حساب**

**التحسينات المقترحة:**
```tsx
<AuthPage>
  {/* Split Screen Design */}
  <LeftSection>
    <Branding>
      <Logo />
      <Tagline>التسوق الذكي يبدأ هنا</Tagline>
    </Branding>
    
    <Features>
      ✓ آلاف المنتجات
      ✓ شحن مجاني
      ✓ استرجاع سهل
      ✓ دفع آمن
    </Features>

    <Testimonial>
      "أفضل موقع تسوق استخدمته!"
      - أحمد محمد
    </Testimonial>
  </LeftSection>

  <RightSection>
    <Form>
      <SocialLogin>
        <GoogleButton />
        <FacebookButton />
      </SocialLogin>

      <Divider>أو</Divider>

      <EmailLogin>
        <Input type="email" />
        <Input type="password" />
        <RememberMe />
        <ForgotPassword />
        <SubmitButton size="lg">
          تسجيل الدخول
        </SubmitButton>
      </EmailLogin>

      <RegisterLink>
        ليس لديك حساب؟ <Link>سجل الآن</Link>
      </RegisterLink>
    </Form>
  </RightSection>
</AuthPage>
```

**الأولوية:** 🟡 عالية  
**الوقت المقدر:** 3-4 ساعات

---

### **12. Wishlist.tsx - المفضلة**

**التحسينات المقترحة:**
```tsx
<WishlistPage>
  {/* Header */}
  <PageHeader>
    <Title>قائمة المفضلة ({count} منتج)</Title>
    <Actions>
      <ShareWishlist />
      <ClearAll />
    </Actions>
  </PageHeader>

  {/* Wishlist Grid */}
  <WishlistGrid>
    {items.map(item => (
      <WishlistCard>
        <Image />
        <Info>
          <Name />
          <Price>
            <Current />
            {discount && <Original />}
          </Price>
          <Availability />
        </Info>
        <Actions>
          <AddToCart size="md" />
          <Remove icon />
        </Actions>
        {priceDropAlert && (
          <Alert>انخفض السعر!</Alert>
        )}
      </WishlistCard>
    ))}
  </WishlistGrid>

  {/* Recommendations */}
  <Recommendations>
    قد تعجبك أيضاً...
  </Recommendations>
</WishlistPage>
```

**الأولوية:** 🟢 متوسطة  
**الوقت المقدر:** 2-3 ساعات

---

### **13. FAQPage.tsx - الأسئلة الشائعة**

**التحسينات المقترحة:**
```tsx
<FAQPage>
  {/* Search */}
  <FAQSearch>
    <SearchBox 
      placeholder="ابحث عن سؤالك..."
      suggestions={popularQuestions}
    />
  </FAQSearch>

  {/* Categories */}
  <FAQCategories>
    <Category icon="shopping">الطلبات والشراء</Category>
    <Category icon="delivery">الشحن والتوصيل</Category>
    <Category icon="return">الإرجاع والاستبدال</Category>
    <Category icon="payment">الدفع</Category>
    <Category icon="account">الحساب</Category>
    <Category icon="affiliate">برنامج الشراكة</Category>
  </FAQCategories>

  {/* FAQ Accordion */}
  <FAQAccordion>
    {faqs.map(faq => (
      <FAQItem>
        <Question>{faq.question}</Question>
        <Answer>
          {faq.answer}
          {faq.helpful && (
            <HelpfulButtons>
              <Button>مفيد 👍</Button>
              <Button>غير مفيد 👎</Button>
            </HelpfulButtons>
          )}
        </Answer>
      </FAQItem>
    ))}
  </FAQAccordion>

  {/* Still Need Help */}
  <ContactSupport>
    <Title>لم تجد إجابتك؟</Title>
    <Button>تواصل مع الدعم</Button>
  </ContactSupport>
</FAQPage>
```

**الأولوية:** 🟢 متوسطة  
**الوقت المقدر:** 2-3 ساعات

---

### **14. ContactPage.tsx - اتصل بنا**

**التحسينات المقترحة:**
```tsx
<ContactPage>
  {/* Hero */}
  <ContactHero>
    <Title>نحن هنا للمساعدة!</Title>
    <Description>تواصل معنا بأي طريقة تفضلها</Description>
  </ContactHero>

  {/* Contact Methods */}
  <ContactMethods>
    <Method>
      <Icon>📞</Icon>
      <Title>اتصل بنا</Title>
      <Value dir="ltr">+20 123 456 7890</Value>
      <Hours>الأحد - الخميس: 9ص - 6م</Hours>
    </Method>
    
    <Method>
      <Icon>✉️</Icon>
      <Title>البريد الإلكتروني</Title>
      <Value>support@egygo.com</Value>
      <Response>نرد خلال 24 ساعة</Response>
    </Method>
    
    <Method>
      <Icon>💬</Icon>
      <Title>الدردشة المباشرة</Title>
      <Button>ابدأ المحادثة</Button>
      <Status online>متصل الآن</Status>
    </Method>
  </ContactMethods>

  {/* Contact Form */}
  <ContactForm>
    <Input label="الاسم" />
    <Input label="البريد الإلكتروني" />
    <Input label="الموضوع" />
    <Textarea label="الرسالة" rows={5} />
    <SubmitButton size="lg">إرسال</SubmitButton>
  </ContactForm>

  {/* Map */}
  <OfficeLocation>
    <Map />
    <Address>
      القاهرة، مصر
      123 شارع التحرير
    </Address>
  </OfficeLocation>

  {/* Social Media */}
  <SocialLinks>
    <Facebook />
    <Instagram />
    <Twitter />
    <WhatsApp />
  </SocialLinks>
</ContactPage>
```

**الأولوية:** 🟢 متوسطة  
**الوقت المقدر:** 2-3 ساعات

---

