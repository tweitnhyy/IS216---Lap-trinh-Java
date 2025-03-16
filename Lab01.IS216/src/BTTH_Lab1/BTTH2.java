package BTTH_Lab1;

import java.util.Scanner;

public class BTTH2 {
    public static void Calc() {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Nhập số a: ");
        double a = scanner.nextDouble();
        System.out.print("Nhập số b: ");
        double b = scanner.nextDouble();

        if (b == 0) {
            System.out.println("Không thể chia cho 0.");
            return;
        }

        double result = a / b;
        System.out.printf("Kết quả %.3f\n", result);
    }
}

