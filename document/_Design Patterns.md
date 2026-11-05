**Slide 1 – Design Patterns** *(\~15 giây)*

> Em chào thầy/cô và các bạn. Nhóm em là \[tên nhóm\], gồm các thành viên \[tên\]. Hôm nay nhóm em xin trình bày về chủ đề Design Patterns, tức là các mẫu thiết kế trong phát triển phần mềm.

**Slide 2 – Agenda** *(\~15 giây)*

> Bài trình bày gồm 5 phần. Đầu tiên, nhóm em giới thiệu design pattern là gì, nguồn gốc của nó và vì sao nên dùng. Sau đó là 3 nhóm pattern chính. Cuối cùng, nhóm em sẽ đi vào chi tiết từng pattern bằng class diagram và demo trực tiếp trên project của nhóm.

**Slide 3 – What is a design pattern?** *(\~30 giây)*

> Design pattern là một giải pháp tổng quát, đã được kiểm chứng, cho những vấn đề thiết kế lặp đi lặp lại trong phần mềm.  
>  Điểm quan trọng là pattern **không phải là code để copy**, cũng không phải thư viện. Nó giống một bản thiết kế: mình hiểu ý tưởng rồi áp dụng vào bài toán của mình.  
>  Pattern còn tạo ra một “ngôn ngữ chung” cho developer. Ví dụ, chỉ cần nói “chỗ này dùng Strategy”, cả team đã hiểu thiết kế mình muốn làm.  
>  Và pattern không phụ thuộc ngôn ngữ: Java, C\#, TypeScript hay Python đều áp dụng được.

**Slide 4 – Where patterns come from** *(\~25 giây)*

> Ý tưởng về pattern bắt nguồn từ ngành kiến trúc. Năm 1977, kiến trúc sư Christopher Alexander mô tả các mẫu thiết kế cho nhà cửa và đô thị.  
>  Đến năm 1994, bốn tác giả Gamma, Helm, Johnson và Vlissides, thường được gọi là **Gang of Four**, đưa ý tưởng này vào phần mềm và xuất bản cuốn sách gồm **23 pattern**. Đây là 23 pattern kinh điển nhóm em trình bày hôm nay.  
>  Mỗi pattern được mô tả bằng 4 thành phần: **tên** gọi, **vấn đề** mà nó giải quyết, **giải pháp** gồm các class và quan hệ giữa chúng, và **hệ quả**, tức là ưu nhược điểm khi áp dụng.

**Slide 5 – Why use design patterns?** *(\~30 giây)*

> Vậy tại sao nên dùng pattern?  
>  Thứ nhất, đây là những giải pháp đã được kiểm chứng, nên giúp mình tránh các lỗi thiết kế phổ biến. Thứ hai, code dễ bảo trì và dễ mở rộng hơn. Thứ ba, team giao tiếp với nhau nhanh hơn.  
>  Đằng sau hầu hết các pattern là vài nguyên lý chung: lập trình theo interface chứ không theo class cụ thể, ưu tiên composition hơn kế thừa, và các nguyên lý SOLID, đặc biệt là Open/Closed và Dependency Inversion.  
>  Tuy nhiên cũng cần lưu ý: pattern nào cũng làm tăng số lượng class. Vì vậy chỉ nên dùng khi thật sự có nhu cầu, không nên áp dụng ở mọi chỗ.

**Slide 6 – Three categories** *(\~25 giây)*

> 23 pattern được chia thành 3 nhóm, dựa trên loại vấn đề mà chúng giải quyết.  
>  **Creational** gồm 5 pattern, trả lời câu hỏi: object được tạo ra như thế nào?  
> 		e.g. Singleton, Factory Method, Builder   
>  **Structural** gồm 7 pattern: các class và object được ghép lại với nhau như thế nào?  
> 		e.g. Adapter, Decorator, Facade   
>  **Behavioral** gồm 11 pattern: các object giao tiếp và phân chia trách nhiệm với nhau như thế nào?  
> 		e.g. Strategy, Observer, State 

**Slide 7 – Creational** *(\~20 giây)*

> Nhóm Creational giúp việc tạo object linh hoạt hơn, để code nghiệp vụ không phụ thuộc vào từ khoá `new`.  
>  **Singleton** đảm bảo chỉ có một instance duy nhất. **Factory Method** để subclass quyết định tạo object nào. **Abstract Factory** tạo ra cả một họ object liên quan đi cùng nhau. **Builder** tạo object phức tạp theo từng bước. **Prototype** tạo object mới bằng cách clone object có sẵn.

**Slide 8 – Structural** *(\~25 giây)*

> Nhóm Structural mô tả cách ghép class và object thành cấu trúc lớn hơn mà vẫn linh hoạt.  
>  **Adapter** giúp hai interface không tương thích làm việc được với nhau, giống như cục chuyển ổ cắm. **Bridge** tách phần trừu tượng ra khỏi phần cài đặt. **Composite** xử lý object đơn lẻ và nhóm object theo cùng một cách, dạng cây. **Decorator** bọc object để thêm chức năng. **Facade** cung cấp một “cửa” đơn giản cho một hệ thống con phức tạp. **Flyweight** chia sẻ phần dữ liệu chung để tiết kiệm bộ nhớ. **Proxy** là object đại diện, kiểm soát việc truy cập vào object thật.

**Slide 9 – Behavioral** *(\~35 giây)*

> Behavioral là nhóm lớn nhất, gồm 11 pattern, mô tả cách các object giao tiếp với nhau.  
>  **Chain of Responsibility** chuyển request qua một chuỗi handler. **Command** đóng gói request thành object để có thể xếp hàng đợi hoặc undo. **Interpreter** xử lý một ngôn ngữ đơn giản. **Iterator** duyệt collection mà không lộ cấu trúc bên trong. **Mediator** cho các object giao tiếp qua một trung gian. **Memento** lưu và khôi phục trạng thái của object. **Observer** thông báo cho các subscriber khi có thay đổi. **State** thay đổi hành vi theo trạng thái. **Strategy** hoán đổi thuật toán lúc runtime. **Template Method** cố định khung các bước của thuật toán. Cuối cùng là **Visitor**, giúp thêm thao tác mới mà không phải sửa các class phần tử.

**Slide 10 – Next: diagrams and live demo** *(\~10 giây)*

> Đó là phần tổng quan. Tiếp theo, nhóm em sẽ chuyển sang draw.io để xem chi tiết class diagram, sau đó demo trực tiếp một pattern trên project của nhóm.

