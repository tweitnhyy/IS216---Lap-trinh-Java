package BTVN;

import java.util.Scanner;

public class BTVN1 {

    public static int ucln(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return Math.abs(a);
    }

    public static int bcnn(int a, int b) {
        return Math.abs(a * b) / ucln(a, b);
    }

    public static void Calc() {
        Scanner sc = new Scanner(System.in);

        System.out.print("Nhap so nguyen a: ");
        int a = sc.nextInt();

        System.out.print("Nhap so nguyen b: ");
        int b = sc.nextInt();

        System.out.println("Uoc chung lon nhat: " + ucln(a, b));
        System.out.println("Boi chung nho nhat: " + bcnn(a, b));
    }
}