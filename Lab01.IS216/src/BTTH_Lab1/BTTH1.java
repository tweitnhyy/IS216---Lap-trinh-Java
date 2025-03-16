package BTTH_Lab1;

import java.util.Scanner;

public class BTTH1 {
    public static void Calc() {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Nhập bán kính của đường tròn: ");
        double radius = scanner.nextDouble();
        double circumference = 2 * Math.PI * radius;
        System.out.printf("Chu vi đường tròn: %.3f\n", circumference);
    }
}
