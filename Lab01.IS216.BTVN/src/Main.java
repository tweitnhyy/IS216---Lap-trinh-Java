import BTVN.*;

import java.util.Scanner;

public class Main {
    public static void main (String[]args){
        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.println("############################");
            System.out.println("1. Bài 1: UCLN & BCNN");
            System.out.println("2. Bài 2: Tìm ước");
            System.out.println("3. Bài 3: Tối giản phân số");
            System.out.println("4. Bài 4: Số hoàn hảo");
            System.out.println("5. Bài 5: Thay thế phần tử mảng");
            System.out.println("6. Bài 6: Xử lý mảng 2 chiều");
            System.out.println("7. Bài 7: Nhiệt độ");
            System.out.println("8. Bài 8: Đọc file");
            System.out.println("9. Bài 9: Palindrome");
            System.out.println("0. Thoát");
            System.out.println("############################");
            System.out.print("Chọn bài toán: ");
            int choice = scanner.nextInt();
            scanner.nextLine();

            switch (choice) {
                case 1:
                    BTVN1.Calc();
                    break;
                case 2:
                    BTVN2.Calc();
                    break;
                case 3:
                    BTVN3.Calc();
                    break;
                case 4:
                    BTVN4.Calc();
                    break;
                case 5:
                    BTVN5.Calc();
                    break;
                case 6:
                    BTVN6.Calc();
                    break;
                case 7:
                    BTVN7.Calc();
                    break;
                case 8:
                    BTVN8.Calc();
                    break;
                case 9:
                    BTVN9.Calc();
                    break;
                case 0:
                    System.out.println("Thoát chương trình.");
                    return;
                default:
                    System.out.println("Lựa chọn không hợp lệ.");
            }
        }
    }
}