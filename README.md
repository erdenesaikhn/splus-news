# SPlus News — байршуулалтын гарын авлага

**Бүтэц:** `splus.news` (нийтийн сайт) · `admin.splus.news` (Space, нэвтрэлттэй) · Supabase (өгөгдөл, нэвтрэлт, зураг) · Netlify (сайт, функц).

Нэг код хоёр хаягаар ажиллана. `admin.` гэж эхэлсэн хаяг руу ортол нэвтрэх цонх гарна. Нийтийн хаяг дээр `#demo`/`#admin` оруулбал автоматаар `admin.` руу шилжинэ.

---

## 1. Supabase (≈10 минут)

1. https://supabase.com → **New project** (бүс: Singapore эсвэл Tokyo хамгийн ойр). Database password-оо хадгал.
2. **SQL Editor → New query** → `supabase/schema.sql`-ийн **бүх агуулгыг** буулгаад **Run**. («Success» гарна.)
3. **Authentication → Sign In / Providers**:
   - **Email** идэвхтэй байг.
   - **Allow anonymous sign-ins** → **асаа**. (Reaction-ыг нэргүй хүн бүр өгөхөд хэрэгтэй, `docs_rx_write` дүрмээр хамгаалагдсан.)
4. **Project Settings → API** дээрээс 3 утга ав: `Project URL`, `anon public`, `service_role` (**нууц**, хэнд ч өгөхгүй).

## 2. Эхний Supervisor ба өгөгдөл шилжүүлэх (компьютер дээр, Node 20+)

```bash
cd splus-news
npm install
export SUPABASE_URL="https://xxxx.supabase.co"
export SUPABASE_SERVICE_KEY="eyJ...service_role..."

node scripts/create-first-admin.mjs you@example.com "НууцҮг12345" "Эрдэнэсайхан"
node scripts/migrate.mjs        # одоогийн тохиргоо (ticker, холбоо барих, реклам…) оруулна
```

Одоогийн сайтад мэдээ, пост, зураг **байгаагүй** тул зөвхөн тохиргоо (`seed/data.json`) шилжинэ. Дараа нь мэдээ оруулахдаа зургаа Space-ээс шууд байршуулна.

## 3. Netlify (≈10 минут)

1. Энэ хавтсыг **GitHub (private repo)** руу push хий. (`node_modules`, `dist` орохгүй, `.gitignore` бэлэн.)
2. https://app.netlify.com → **Add new site → Import from Git** → repo сонго. Тохиргоо `netlify.toml`-д бий (build: `node build.mjs`, publish: `dist`).
3. **Site configuration → Environment variables** (`.env.example` харна уу):
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `ROOT_DOMAIN=splus.news`
   - `SUPABASE_SERVICE_KEY` — **Secret** гэж тэмдэглэ, scope: *Functions*.
4. **Deploy**. Амжилттай бол түр хаяг (`xxx.netlify.app`) дээр сайт нээгдэнэ.

## 4. Домэйн

1. Netlify → **Domain management → Add a domain** → `splus.news`.
2. Дараа нь **Add domain alias** → `admin.splus.news`.
3. Домэйн бүртгэгч дээрээ Netlify-ийн заасан DNS бичлэгүүдийг тавина (A/ALIAS `splus.news`, CNAME `admin` → `xxx.netlify.app`). Эсвэл Netlify DNS руу nameserver шилжүүлнэ.
4. **HTTPS → Verify DNS → Provision certificate** (Let's Encrypt, автомат).

## 5. Шалгах жагсаалт

- [ ] `https://splus.news` нээгдэж, мэдээ харагдана.
- [ ] `https://admin.splus.news` → нэвтрэх цонх → таны имэйлээр орно.
- [ ] Space → Мэдээ нэмэх → нийтэл → `splus.news`-д гарна.
- [ ] Мэдээ нээж **Хуваалцах → Хуулах** → `https://splus.news/n/xxxxxx` хэлбэртэй холбоос.
- [ ] Тэр холбоосыг Facebook Sharing Debugger / Telegram-д хийхэд гарчиг, зураг гарна (Open Graph).
- [ ] Space → Хэрэглэгч нэмэх → Agent үүсгээд, тэр хаягаар орж **зөвхөн өөрийн мэдээг** харж/засч байгааг шалга.

## Эрх

| | Supervisor | Agent |
|---|---|---|
| Мэдээ нэмэх | ✔ | ✔ (нээсэн бол) |
| Мэдээг засах/устгах | **бүгдийг** | **зөвхөн өөрийнхөө** |
| Тохиргоо (төрөл, шуурхай, реклам, эффект, холбоо барих, засвар) | ✔ | зөвхөн нээж өгсөн цонх |
| Хэрэглэгч нэмэх/устгах/эрх өөрчлөх | ✔ | ✘ |

Хамгаалалт нь зөвхөн дэлгэц дээр биш **Supabase RLS дүрмээр** сервер дээр хэрэгжинэ (`supabase/schema.sql`). Хэрэглэгч нэмэх/устгах нь `netlify/functions/*` дээр service key-ээр, зөвхөн Supervisor token шалгаад ажиллана.

## Сайтыг дараа нь засварлах

`source/splus-news.html` нь Claude дээр бүтээсэн эх хувилбар. Шинэ засвар орсон эх файлыг авсны дараа:

```bash
python3 scripts/patch.py source/splus-news.html site-src/index.html
git add -A && git commit -m "update" && git push     # Netlify автоматаар дахин build хийнэ
```

`patch.py` нь Supabase нэвтрэлт, `/n/…` холбоос, Agent хязгаарыг автоматаар дахин оруулна. Эх файл өөрчлөгдөж засвар хийх хэсэг олдохгүй бол алдаа өгөөд зогсоно (чимээгүй эвдэхгүй).

## Мэдэх ёстой хязгаарлалт

- **Бодит Supabase/Netlify дээр би турших боломжгүй байсан.** Нэвтрэлт, Agent хязгаар, `/n/` холбоос, Open Graph логикийг Supabase-ийг дууриасан орчинд шалгасан. Анхны жинхэнэ байршуулалт дээр жижиг зүйл засах шаардлага гарч магадгүй. Тэр үед алдааны мессеж (Netlify deploy log, браузерын console)-ийг явуулаарай.
- **Тохиргооны эрх** нь «Supervisor, эсвэл тохиргооны ямар нэг цонх нээгдсэн Agent» гэж RLS дээр бүхэлд нь хамаарна. Цонх бүрээр нь сервер дээр ялгахгүй, дэлгэц дээр л нуугдана.
- **Reaction**: нэргүй session тус бүр нэг санал өгнө. Хөтөч/хэрэгслээ солих хүн дахин санал өгч чадна. Бүрэн хамгаалалт хэрэгтэй бол Supabase Auth-ийн rate limit-ийг чангатгах, Cloudflare Turnstile нэмэх.
- **Supabase үнэгүй багц** 7 хоног идэвхгүй бол төслийг түр зогсоодог. Жинхэнэ сайтад Pro багц сонгоно уу.
- Хэрэглэгчийн нууц үгийг сэргээх «Нууц үгээ мартсан» хуудас алга. Supervisor Supabase → Authentication → Users дээрээс шинэ нууц үг тавина.
- Зураг/бичлэг: Storage-ийн нэг файлын дээд хэмжээ 50 MB (`schema.sql`).
