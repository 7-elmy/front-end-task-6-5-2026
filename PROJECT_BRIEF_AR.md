# Ecommerce Helmy - شرح شامل سريع

هذا الملف مرجع سريع يساعدك تشرح المشروع لأي شخص (تكنيكال أو غير تكنيكال) بثقة.

---

## 1) فكرة المشروع

`Ecommerce Helmy` هو متجر إلكتروني Fashion Store مبني بواجهة حديثة وسريعة، ويدعم:

- عرض المنتجات والتفاصيل
- البحث والفلترة والترتيب
- تسجيل دخول/حساب جديد
- سلة مشتريات
- صفحة Profile
- دعم لغتين (عربي/إنجليزي) مع RTL
- SEO + أداء جيد

---

## 2) ERB (Executive Response Brief) - رد مختصر جاهز

لو أحد سألك "ايه مشروعك؟" استخدم الرد ده:

> Ecommerce Helmy عبارة عن متجر إلكتروني متكامل معمول بـ React + Vite + Tailwind.  
> فيه Product Listing مع Filters/Search، Product Details، Auth كامل بـ JWT (Login/Register + Refresh Token)، Cart، Profile، ودعم عربي/إنجليزي.  
> المشروع مربوط بمنتجات من FakeStoreAPI، والأوث مربوط بـ DummyJSON، مع تنظيم state وإدارة session بشكل عملي.

---

## 3) التقنيات المستخدمة

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- i18next (ar/en)
- shadcn/ui + Radix UI
- Sonner (Toast)

---

## 4) هيكل الصفحات الأساسي

- `/` الصفحة الرئيسية: Hero + Products + Filters + Pagination
- `/product/:id` تفاصيل المنتج + Related Products
- `/login` تسجيل دخول
- `/register` إنشاء حساب
- `/cart` سلة المشتريات
- `/profile` صفحة المستخدم

---

## 4.1) URLs الصفحات المستخدمة

المسارات الفعلية داخل التطبيق:

- `GET /`  
  الصفحة الرئيسية (Landing + Products)

- `GET /product/:id`  
  صفحة تفاصيل المنتج حسب رقم المنتج (مثال: `/product/1`)

- `GET /login`  
  صفحة تسجيل الدخول (Guest-only)

- `GET /register`  
  صفحة إنشاء حساب (Guest-only)

- `GET /cart`  
  صفحة سلة المشتريات

- `GET /profile`  
  صفحة حساب المستخدم (محميّة وتتطلب login)

- `GET *`  
  صفحة Not Found لأي route غير معروف

---

## 5) الـ Features المهمة

### UI/UX
- Navbar responsive + mobile drawer
- Filters sidebar (desktop) + drawer (mobile)
- Skeleton loading
- Dark/Light + Spotify/Discord themes

### Auth
- منع المستخدم المسجل من الرجوع لصفحات login/register
- منع add to cart بدون login
- Session محفوظة في localStorage

### Localization
- ترجمة static content للعربي والإنجليزي
- تغيير اتجاه الصفحة تلقائيًا `ltr/rtl`

### SEO
- عنوان/وصف/keywords
- Open Graph + Twitter + Canonical

---

## 5.2) الفلترة (Filters) متعملة إزاي؟

الفلترة في المشروع متقسمة لجزئين: **UI** و **Logic**.

### A) UI (واجهة الفلاتر)

- المكون المسؤول: `src/components/FiltersSidebar.tsx`
- يدعم:
  - اختيار category
  - price range slider
  - sort (featured / low-high / high-low)
  - clear all
- Desktop:
  - Sidebar ثابتة (sticky)
- Mobile:
  - Drawer/Sheet

### B) State Management للفلاتر

في `Home.tsx` يوجد state بالشكل التالي:

- `category`
- `sort`
- `priceRange`

ويتم تمريرها إلى `FiltersSidebar` عبر:

- `value={filters}`
- `onChange={setFilters...}`

### C) منطق الفلترة الفعلي

داخل `Home.tsx` باستخدام `useMemo`:

1. يتم جلب كل المنتجات من query (`productsQ.data`)
2. يتم فلترة المنتجات حسب:
   - category
   - السعر داخل الـ range
   - نص البحث القادم من navbar (`q` في URL)
3. يتم تطبيق sort حسب اختيار المستخدم
4. يتم عمل pagination على الناتج النهائي

### D) ترتيب التنفيذ

الـ pipeline الحالية:

`products from API`  
→ `category + price + search filtering`  
→ `sorting`  
→ `pagination`  
→ `render cards`

---

## 5.1) سيكل الـ Auth بالتفصيل

### 1) Register

1. المستخدم يسجل من صفحة `register`.
2. `AuthForm` ينادي `register(...)` داخل `AuthContext`.
3. يتم استدعاء:
   - `POST https://dummyjson.com/users/add`
4. بعد نجاح التسجيل يتم تنفيذ login مباشرة.
5. يتم استلام:
   - `accessToken`
   - `refreshToken`
   - user payload
6. يتم حفظ الجلسة في `localStorage`.

### 2) Login

1. المستخدم يدخل بياناته من `login`.
2. `AuthForm` ينادي `login(...)`.
3. يتم استدعاء:
   - `POST https://dummyjson.com/auth/login`
4. يتم حفظ:
   - `accessToken`
   - `refreshToken`
   - بيانات المستخدم

### 3) Session Bootstrap (عند فتح التطبيق)

1. `AuthContext` يقرأ session من `localStorage`.
2. يفحص صلاحية `accessToken` من JWT payload.
3. إذا انتهى أو قرب ينتهي token:
   - ينفذ `POST /auth/refresh`
   - يحدث tokens الجديدة
4. يستخدم profile cache لو صالح.
5. لو cache غير صالح:
   - ينفذ `GET /auth/me`
6. يحدث state (`user`, `token`) داخل التطبيق.

### 4) Route Guards

- `login/register` صفحات Guest-only:
  - المستخدم المسجل يتم تحويله للصفحة الرئيسية.
- `profile` صفحة محمية:
  - المستخدم غير المسجل يتم تحويله إلى `/login`.

### 5) Protected Actions

- إضافة منتجات للسلة (`Add to Cart`) في:
  - Product Card
  - Product Details
- لو المستخدم غير مسجل:
  - Toast تنبيه
  - Redirect إلى `/login`

### 6) Logout

1. مسح `user/token` من state.
2. حذف session وprofile cache من `localStorage`.
3. رجوع المستخدم لحالة Guest.

---

## 6) ربط الـ API (مهم)

المشروع مربوط على APIين:

### A) Products API
- Base URL: `https://fakestoreapi.com`
- المستخدم في: `src/lib/api.ts`
- Endpoints:
  - `GET /products`
  - `GET /products/:id`
  - `GET /products/categories`

### B) Auth API
- Base URL: `https://dummyjson.com`
- المستخدم في: `src/lib/authApi.ts`
- Endpoints:
  - `POST /users/add` (register)
  - `POST /auth/login` (login)
  - `GET /auth/me` (profile)
  - `POST /auth/refresh` (refresh token)

---

## 6.2) ربط الـ API في المشروع متعمل إزاي؟

### A) Layer التنظيم

الربط معمول بطريقة Service Layer:

- Products services: `src/lib/api.ts`
- Auth services: `src/lib/authApi.ts`

ده معناه إن الصفحات لا تنادي fetch مباشرة في كل مكان، لكن تستخدم دوال جاهزة ومركزية.

### B) Environment-based Base URLs

الـ base URLs جاية من `.env`:

```env
VITE_API_BASE_URL=https://fakestoreapi.com
VITE_AUTH_BASE_URL=https://dummyjson.com
```

وفي الكود:

- `api.ts` يستخدم: `import.meta.env.VITE_API_BASE_URL`
- `authApi.ts` يستخدم: `import.meta.env.VITE_AUTH_BASE_URL`

### C) Products API Flow

1. `Home` و `ProductDetails` ينادوا دوال products:
   - `fetchProducts`
   - `fetchProduct`
   - `fetchCategories`
2. الاستدعاء يتم عبر TanStack Query (`useQuery`).
3. Query مسؤولة عن:
   - caching
   - loading state
   - error state
   - staleTime

### D) Auth API Flow

1. `AuthForm` يمرر بيانات المستخدم إلى `AuthContext`.
2. `AuthContext` ينادي دوال `authApi.ts`:
   - login
   - register
   - refresh
   - profile
3. يتم حفظ access/refresh token وإدارة session في localStorage.
4. يتم refresh تلقائي عند انتهاء access token.

### E) Handling الأخطاء

في `authApi.ts` يوجد handler موحد للـ responses:

- إذا response غير ناجح:
  - يتم استخراج message إن وجد
  - throw Error
- إذا ناجح:
  - return JSON typed response

---

## 6.1) هل السلة مربوطة بـ API؟

لا، في النسخة الحالية السلة **مش مربوطة بـ API خارجي** للإضافة أو الحذف.

### المستخدم فعليًا لإدارة السلة:

- `CartContext` في:
  - `src/contexts/CartContext.tsx`
- Local state باستخدام `useState`
- Persist في `localStorage` بالمفتاح:
  - `helmy_cart`

### العمليات الموجودة:

- `addToCart(product, size?)`
- `removeFromCart(productId, size?)`
- `updateQuantity(productId, quantity, size?)`
- `clearCart()`

### ملحوظة مهمة للشرح:

السلة هنا client-side cart (frontend cart) مناسبة للديمو/النسخ الأولية.  
في بيئة production متقدمة، الأفضل ربطها بـ Cart API في backend عشان:

- مزامنة السلة بين الأجهزة
- حفظ السلة على مستوى المستخدم
- دعم checkout الحقيقي وربط الطلبات

---

## 7) طريقة الربط في الكود باختصار

### Environment Variables
في ملف `.env`:

```env
VITE_API_BASE_URL=https://fakestoreapi.com
VITE_AUTH_BASE_URL=https://dummyjson.com
```

### Products
- `fetchProducts`, `fetchProduct`, `fetchCategories`
- الاستدعاء من الصفحات عبر `useQuery`

### Auth
- `AuthContext` مسؤول عن:
  - login/register
  - حفظ token + refreshToken
  - قراءة session عند فتح التطبيق
  - refresh تلقائي عند قرب انتهاء token
  - cache بسيط لبيانات profile

---

## 8) تجربة تسجيل الدخول (Demo)

للتجربة السريعة:

- Email: `emilys@gmail.com`
- Password: `emilyspass`

وموجود زر داخل صفحة login:
- `Use demo account`

---

## 9) إجابات جاهزة للأسئلة الشائعة

### س: إزاي عامل auth؟
ج: عامل auth باستخدام JWT عبر DummyJSON مع access token + refresh token، والجلسة محفوظة ومُدارة داخل AuthContext.

### س: إزاي ربطت المنتجات؟
ج: استخدمت FakeStoreAPI من خلال service layer في `src/lib/api.ts` ثم استهلاك البيانات عبر TanStack Query.

### س: هل في حماية للـ routes؟
ج: نعم، صفحات login/register Guest-only، وعمليات add-to-cart محمية وتتطلب login.

### س: هل يدعم العربي؟
ج: نعم، كامل ar/en مع RTL/LTR.

---

## 10) أوامر التشغيل

```bash
npm install
npm run dev
npm run build
npm run preview
```

---

## 11) نسخة رد سريعة جدًا (30 ثانية)

> عملت متجر إلكتروني كامل بـ React/Vite/Tailwind، فيه عرض منتجات + فلترة + تفاصيل + سلة + Auth بـ JWT + Profile + دعم عربي/إنجليزي + SEO.  
> ربطت المنتجات بـ FakeStoreAPI والأوث بـ DummyJSON، ونظمت إدارة الجلسة والتوكن داخل AuthContext.

---

## 12) شرح حرفي لجزء `ProductDetails` (Query + Related)

الجزء ده موجود في `src/pages/ProductDetails.tsx` ووظيفته تحميل المنتج الحالي ثم تحميل المنتجات المرتبطة.

### الكود المقصود

```ts
const { data, isLoading, isError } = useQuery({
  queryKey: ["product", id],
  queryFn: () => fetchProduct(id!),
  enabled: !!id,
  staleTime: 1000 * 60 * 5,
});
const relatedQ = useQuery({
  queryKey: ["related-products", data?.category],
  queryFn: fetchProducts,
  enabled: !!data?.category,
  staleTime: 1000 * 60 * 5,
});
const related = useMemo(
  () => (relatedQ.data ?? []).filter((p) => p.category === data?.category && p.id !== data?.id).slice(0, 4),
  [relatedQ.data, data?.category, data?.id],
);
```

### شرح حرفي

#### 1) Query المنتج الأساسي

- `const { data, isLoading, isError } = useQuery({...})`
  - ينشئ Query لتحميل **منتج واحد**.
  - `data`: بيانات المنتج.
  - `isLoading`: حالة التحميل.
  - `isError`: حالة الخطأ.

- `queryKey: ["product", id]`
  - مفتاح الكاش للـ query.
  - وجود `id` داخل المفتاح يخلي كل منتج له كاش مستقل.

- `queryFn: () => fetchProduct(id!)`
  - الدالة التي تنفذ request فعليًا.
  - `id!` لأن TypeScript يعتبر `id` ممكن يكون undefined، وهنا نؤكد أنه موجود وقت التنفيذ.

- `enabled: !!id`
  - query تشتغل فقط إذا `id` موجود.
  - يمنع request خاطئ لو route param لسه مش متاح.

- `staleTime: 1000 * 60 * 5`
  - يعتبر البيانات fresh لمدة 5 دقائق.
  - يقلل إعادة التحميل غير الضرورية.

#### 2) Query المنتجات المرتبطة

- `const relatedQ = useQuery({...})`
  - Query ثانية لتحميل قائمة المنتجات كلها (لاستخراج related منها).

- `queryKey: ["related-products", data?.category]`
  - كاش مرتبط بالـ category الحالية.
  - لو category اتغيرت، الكاش يكون مختلف.

- `queryFn: fetchProducts`
  - يحمل كل المنتجات.

- `enabled: !!data?.category`
  - لا تعمل query إلا بعد ما المنتج الأساسي يحمّل ويكون له category.

- `staleTime: 1000 * 60 * 5`
  - نفس سياسة freshness: 5 دقائق.

#### 3) استخراج related list

- `const related = useMemo(...)`
  - يحسب related products بشكل memoized لتحسين الأداء.

- `(relatedQ.data ?? [])`
  - لو مفيش بيانات بعد، استخدم array فاضية لتجنب errors.

- `.filter((p) => p.category === data?.category && p.id !== data?.id)`
  - يختار المنتجات من نفس التصنيف.
  - يستبعد المنتج الحالي نفسه.

- `.slice(0, 4)`
  - يعرض أول 4 منتجات فقط.

- dependencies:
  - `[relatedQ.data, data?.category, data?.id]`
  - إعادة الحساب تحصل فقط عند تغير هذه القيم.

