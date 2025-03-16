package BTVN;

import java.util.Scanner;

public class BTVN2 {
    public static void Calc() {
        Scanner sc = new Scanner(System.in);

        System.out.print("Nhap so nguyen duong n: ");
        int n = sc.nextInt();

        if (n <= 0) {
            System.out.println("Vui long nhap so nguyen duong.");
        } else {
            System.out.println("Cac uoc so cua " + n + " la: ");
            for (int i = 1; i <= n; i++) {
                if (n % i == 0) {
                    System.out.print(i + " ");
                }
            }
        }
    }
}
