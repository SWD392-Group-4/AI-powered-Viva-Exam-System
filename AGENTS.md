# Quy Tac Phat Trien Du An AIVES (Agent Instructions)

Tat ca cac AI Agent va Developer khi lam viec trong repository nay bat buoc phai tuan thu nghiem ngat cac nguyen tac sau:

## 1. Docs La Source of Truth (Single Source of Truth)
- Toan bo dac ta he thong nam trong thu muc `AI-powered-Viva-Exam-System/document/`.
- Moi thay doi code moi (Backend `aives-backend`, Frontend `aives-frontend`, Mobile `aives-mobile`) **phai bam sat 100% theo tai lieu**.

## 2. Quy Trinh "Doc First - Code Later"
- Khi gap yeu cau moi, tinh nang moi hoac luong ma tai lieu chua dinh nghia:
  1. **Khong duoc tu y viet code.**
  2. Trao doi, xac nhan (confirm) phuong an voi nguoi dung.
  3. **Cap nhat tai lieu truoc** (kien truc, business rules, API, UI flow).
  4. Sau khi tai lieu da chuan hoa, moi duoc tien hanh viet code theo tai lieu.

## 3. Khong Tu Y Chay Test (No Unrequested Tests)
- **Tuyet doi khong bao gio tu y chay test** (Unit Test, Integration Test, E2E Test, `mvn test`, `npm test`, v.v.) tru khi nguoi dung yeu cau truc tiep.
- Khi can build hoac package du an, bat buoc phai bo qua buoc test (vi du voi Maven: `-DskipTests`).

## 4. Bat Buoc Commit Va Push Len Main Sau Moi Thay Doi (Mandatory Git Delivery)
- **Tat ca cac role (BA, PM, PO, Tech Lead, Backend, Frontend, QA, UI-UX, Architect) khi hoan thanh bat ky thay doi nao (chinh sua docs, cap nhat ticket, viet code, sua bug) deu BAT BUOC phai commit va push ngay len `origin main`**.
- Do du an bao gom nhieu git repository con (`AI-powered-Viva-Exam-System`, `aives-backend`, `aives-frontend`, `aives-mobile`), agent phai xac dinh dung git root cua thu muc vua sua doi.
- Khong bao gio duoc de lai thay doi chua commit (uncommitted changes) hoac chua push (unpushed commits).
- Quy trinh thuc hien:
  1. `git status` kiem tra cac file da thay doi/tao moi trong git repository tuong ung.
  2. `git add <files>` stage dung cac file lien quan.
  3. `git commit -m "[<role/ticket-id>] <mo ta cong viec>"`
  4. `git pull --rebase origin main` (neu can)
  5. `git push origin main`
