package BTTH_Lab1;

public class BTTH8 {
    public static void Calc() {
        int size = 10;

        System.out.println("Bang tinh Pythagoras:");

        System.out.print("\t");
        for (int i = 1; i <= size; i++) {
            System.out.print(i + "\t");
        }
        System.out.println();

        for (int i = 1; i <= size; i++) {
            System.out.print(i + "\t");
            for (int j = 1; j <= size; j++) {
                System.out.print(i * j + "\t");
            }
            System.out.println();
        }
    }
}
