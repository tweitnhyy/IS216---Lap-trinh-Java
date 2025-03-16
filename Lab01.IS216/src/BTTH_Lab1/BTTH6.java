package BTTH_Lab1;

import java.util.Scanner;

public class BTTH6 {
    public static void Calc()
    {
        Scanner in = new Scanner(System.in);

        int function;

        do
        {
            System.out.println("####################################");
            System.out.println("1.                  Bài 1");
            System.out.println("2.                  Bài 2");
            System.out.println("3.                  Bài 3");
            System.out.println("4.                  Bài 4");
            System.out.println("5.                  Bài 5");
            System.out.println("6.                  Thoát");
            System.out.println("####################################");
            System.out.print("Chọn chức năng: ");
            function = in.nextInt();
            switch (function)
            {
                case 1:
                    bai1();
                    break;
                case 2:
                    bai2();
                    break;
                case 3:
                    bai3();
                    break;
                case 4:
                    bai4();
                    break;
                case 5:
                    bai5();
                    break;
                case 6:
                    System.out.println("Thoát chương trình");
                    break;
                default:
                    System.out.println("Lựa chọn không hợp lệ");
            }
        } while (function != 6);
    }

    public static void bai1()
    {
        System.out.println("Bạn đã chọn bài 1.");
    }

    public static void bai2()
    {
        System.out.println("Bạn đã chọn bài 2.");
    }

    public static void bai3()
    {
        System.out.println("Bạn đã chọn bài 3.");
    }

    public static void bai4()
    {
        System.out.println("Bạn đã chọn bài 4.");
    }

    public static void bai5()
    {
        System.out.println("Bạn đã chọn bài 5.");
    }
}
