package BTTH_Lab1;
import java.util.Scanner;

public class BTTH4 {
    public static void Calc() {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Nhập chuỗi x: ");
        String x = scanner.nextLine();
        System.out.print("Nhập chuỗi y: ");
        String y = scanner.nextLine();

        System.out.println("Chiều dài chuỗi x: " + x.length());
        System.out.println("Ba ký tự đầu tiên của x: " + (x.length() >= 3 ? x.substring(0, 3) : x));
        System.out.println("Ba ký tự cuối của x: " + (x.length() >= 3 ? x.substring(x.length() - 3) : x));
        System.out.println("Ký tự thứ 4 của x: " + (x.length() >= 4 ? x.charAt(3) : "Không có ký tự thứ 4"));

        String newString = (x.length() >= 3 ? x.substring(0, 3) : x) + (y.length() >= 3 ? y.substring(y.length() - 3) : y);
        System.out.println("Chuỗi mới ghép từ x và y: " + newString);

        System.out.println("x có bằng y không (phân biệt hoa thường)? " + x.equals(y));
        System.out.println("x có bằng y không (không phân biệt hoa thường)? " + x.equalsIgnoreCase(y));

        System.out.print("Nhập chuỗi cần tìm trong x: ");
        String search = scanner.nextLine();
        int index = x.indexOf(search);
        if (index != -1) {
            System.out.println("Chuỗi \"" + search + "\" xuất hiện tại vị trí: " + index);
        } else {
            System.out.println("Chuỗi \"" + search + "\" không xuất hiện trong x.");
        }
    }
}
