
import BTTH_Lab1.*;

import java.util.Scanner;

public class Main {
        public static void main (String[]args){
            Scanner scanner = new Scanner(System.in);
            while (true) {
                System.out.println("############################");
                System.out.println("1. Bài 1: Chu vi đường tròn");
                System.out.println("2. Bài 2: Chia 2 số");
                System.out.println("3. Bài 3: Tính toán phân số");
                System.out.println("4. Bài 4: Xử lý chuỗi");
                System.out.println("5. Bài 5: Tính tiền điện");
                System.out.println("6. Bài 6: Gọi 5 bài đầu tiên");
                System.out.println("7. Bài 7: Kiểm tra số nguyên tố");
                System.out.println("8. Bài 8: Bảng tính Pythagoras");
                System.out.println("9. Bài 9: Xử lý mảng");
                System.out.println("0. Thoát");
                System.out.println("############################");
                System.out.print("Chọn bài toán: ");
                int choice = scanner.nextInt();
                scanner.nextLine();

                switch (choice) {
                    case 1:
                        BTTH1.Calc();
                        break;
                    case 2:
                        BTTH2.Calc();
                        break;
                    case 3:
                        BTTH3.Fraction.Calc();
                        break;
                    case 4:
                        BTTH4.Calc();
                        break;
                    case 5:
                        BTTH5.Calc();
                        break;
                    case 6:
                        BTTH6.Calc();
                        break;
                    case 7:
                        BTTH7.Calc();
                        break;
                    case 8:
                        BTTH8.Calc();
                        break;
                    case 9:
                        BTTH9.Calc();
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