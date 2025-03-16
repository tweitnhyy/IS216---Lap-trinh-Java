package BTTH_Lab1;

import java.util.Scanner;

public class BTTH5 {
    public static int tinhTienDien(int soDien) {
        int tienDien = 0;
        if (soDien <= 50)
            tienDien = soDien * 2000;
        else if (soDien <= 100)
            tienDien = 50 * 2000 + (soDien - 50) * 2500;
        else
            tienDien = 50 * 2000 + 50 * 2500 + (soDien - 100) * 3500;
        return tienDien;
    }

    public static void Calc() {
        Scanner in = new Scanner(System.in);
        System.out.print("Nhap so dien su dang trong thang: ");
        int soDien = in.nextInt();

        if (soDien < 0)
            System.out.println("So dien khong hop le!");
        else {
            int tien = tinhTienDien(soDien);
            System.out.println("Tien dien phai tra: " + tien + " d");
        }
    }
}
