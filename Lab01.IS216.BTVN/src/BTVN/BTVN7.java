package BTVN;

import java.io.*;
import java.util.*;

public class BTVN7 {
    public static void Calc() {
        String inputFile = "src/BTVN/input.txt";
        String outputFile = "src/BTVN/output.txt"; // Sửa output để tránh ghi đè lên input
        File file = new File(inputFile);

        if (!file.exists()) {
            System.out.println("File \"" + inputFile + "\" not found. Please create the file or provide the correct path.");
            return; // Thoát nếu không tìm thấy file
        }

        try (BufferedReader br = new BufferedReader(new FileReader(inputFile));
             BufferedWriter bw = new BufferedWriter(new FileWriter(outputFile))) {

            String line = br.readLine();
            if (line == null || line.trim().isEmpty()) {
                System.out.println("File is empty or does not have a valid day count.");
                return;
            }

            int days;
            try {
                days = Integer.parseInt(line.trim());
            } catch (NumberFormatException e) {
                System.out.println("Invalid day count format in file.");
                return;
            }

            double overallMin = Double.MAX_VALUE, overallMax = Double.MIN_VALUE, overallSum = 0;
            int totalReadings = 0;

            for (int i = 0; i < days; i++) {
                line = br.readLine();
                if (line == null || line.trim().isEmpty()) {
                    System.out.println("Missing temperature data for day " + (i + 1));
                    continue;
                }

                String[] tempStr = line.trim().split(" ");
                double[] temps = Arrays.stream(tempStr).mapToDouble(Double::parseDouble).toArray();

                double minTemp = Arrays.stream(temps).min().orElse(Double.MAX_VALUE);
                double maxTemp = Arrays.stream(temps).max().orElse(Double.MIN_VALUE);
                double avgTemp = Arrays.stream(temps).average().orElse(0);

                overallMin = Math.min(overallMin, minTemp);
                overallMax = Math.max(overallMax, maxTemp);
                overallSum += Arrays.stream(temps).sum();
                totalReadings += temps.length;

                bw.write(String.format("Day %d - Min: %.1f, Max: %.1f, Avg: %.1f\n", i + 1, minTemp, maxTemp, avgTemp));
            }

            if (totalReadings > 0) {
                double overallAvg = overallSum / totalReadings;
                bw.write(String.format("Overall - Min: %.1f, Max: %.1f, Avg: %.1f\n", overallMin, overallMax, overallAvg));
            } else {
                System.out.println("No valid temperature data found.");
            }

        } catch (IOException e) {
            System.out.println("Error reading or writing file: " + e.getMessage());
        } catch (NumberFormatException e) {
            System.out.println("Invalid temperature format in file.");
        }
    }

}
