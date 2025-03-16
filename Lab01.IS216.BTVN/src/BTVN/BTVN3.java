package BTVN;

import java.util.Scanner;

public class BTVN3 {

    public static int ucln(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return Math.abs(a);
    }

    public static void  Calc() {
        Scanner sc = new Scanner(System.in);

        System.out.print("Nhap tu so: ");
        int a = sc.nextInt();

        System.out.print("Nhap mau so: ");
        int b = sc.nextInt();

        if (b == 0) {
            System.out.println("Mau so khong the bang 0.");
        } else {
            int ucln = ucln(a, b);
            a /= ucln;
            b /= ucln;

            if (b < 0) {
                a = -a;
                b = -b;
            }

            System.out.println("Phan so sau khi don gian: " + a + "/" + b);
        }

    }
}
