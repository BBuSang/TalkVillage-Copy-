package Project.Backend.services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Project.Backend.entity.CrossWordGameWord;
import Project.Backend.repository.CrossWordGameWordRepository;

@Service
public class CrossWordGameWordService {
    @Autowired
    private CrossWordGameWordRepository wordRepository;

    public Map<String, Object> generatePuzzle() {
        List<CrossWordGameWord> allWords = wordRepository.findAll();
        List<CrossWordGameWord> selectedWords = new ArrayList<>();
        String[][] grid = new String[20][20];
        List<Map<String, Object>> wordPositions = new ArrayList<>();
        Random random = new Random();

        // 그리드 초기화
        for (int i = 0; i < 20; i++) {
            for (int j = 0; j < 20; j++) {
                grid[i][j] = "";
            }
        }

        // 전체 단어 목록을 섞고 20개 선택
        if (!allWords.isEmpty()) {
            List<CrossWordGameWord> shuffledWords = new ArrayList<>(allWords);
            Collections.shuffle(shuffledWords, random);
            
            while (shuffledWords.size() < 20) {
                shuffledWords.addAll(new ArrayList<>(shuffledWords));
            }
            
            selectedWords = shuffledWords.subList(0, 20);
            selectedWords.sort((a, b) -> b.getWord().length() - a.getWord().length());

            // 첫 번째 단어는 중앙에 가로로 배치
            CrossWordGameWord firstWord = selectedWords.get(0);
            int centerRow = grid.length / 2;
            int startCol = (grid[0].length - firstWord.getWord().length()) / 2;
            placeWordHorizontally(grid, firstWord, centerRow, startCol, wordPositions, 1);

            // 나머지 단어들 배치
            for (int i = 1; i < selectedWords.size(); i++) {
                CrossWordGameWord word = selectedWords.get(i);
                List<IntersectionPoint> intersections = findIntersections(grid, word.getWord());
                
                if (!intersections.isEmpty()) {
                    // 교차점이 있으면 교차하도록 배치
                    IntersectionPoint intersection = intersections.get(random.nextInt(intersections.size()));
                    if (intersection.direction.equals("HORIZONTAL")) {
                        if (intersection.col >= 0 && intersection.col + word.getWord().length() < grid[0].length) {
                            placeWordHorizontally(grid, word, intersection.row, intersection.col, wordPositions, i + 1);
                        }
                    } else {
                        if (intersection.row >= 0 && intersection.row + word.getWord().length() < grid.length) {
                            placeWordVertically(grid, word, intersection.row, intersection.col, wordPositions, i + 1);
                        }
                    }
                } else {
                    // 교차점이 없으면 빈 공간에 배치
                    boolean placed = false;
                    for (int row = 1; row < grid.length - 1 && !placed; row++) {
                        for (int col = 1; col < grid[0].length - 1 && !placed; col++) {
                            if (random.nextBoolean()) {
                                if (canPlaceHorizontally(grid, word.getWord(), row, col)) {
                                    placeWordHorizontally(grid, word, row, col, wordPositions, i + 1);
                                    placed = true;
                                }
                            } else {
                                if (canPlaceVertically(grid, word.getWord(), row, col)) {
                                    placeWordVertically(grid, word, row, col, wordPositions, i + 1);
                                    placed = true;
                                }
                            }
                        }
                    }
                }
            }
        }

        Map<String, Object> puzzle = new HashMap<>();
        puzzle.put("grid", grid);
        puzzle.put("wordPositions", wordPositions);
        return puzzle;
    }

    private boolean canPlaceWordAtPosition(String[][] grid, CrossWordGameWord word, int row, int col) {
        String wordStr = word.getWord().toLowerCase();
        
        // 가로 배치 시도
        if (canPlaceHorizontally(grid, wordStr, row, col)) {
            return true;
        }
        
        // 세로 배치 시도
        if (canPlaceVertically(grid, wordStr, row, col)) {
            return true;
        }
        
        return false;
    }

    private void placeWordInGrid(String[][] grid, CrossWordGameWord word, 
            List<Map<String, Object>> wordPositions, int wordNumber) {
        String wordStr = word.getWord().toLowerCase();
        
        // 첫 번째 단어는 중앙에 가로로 배치
        if (wordNumber == 1) {
            int centerRow = grid.length / 2;
            int startCol = (grid[0].length - wordStr.length()) / 2;
            placeWordHorizontally(grid, word, centerRow, startCol, wordPositions, wordNumber);
            return;
        }

        List<IntersectionPoint> intersections = findIntersections(grid, wordStr);
        
        // 교차점이 없으면 배치하지 않음
        if (intersections.isEmpty()) {
            return;
        }

        // 교차점 중 하나를 무작위로 선택
        Random random = new Random();
        IntersectionPoint intersection = intersections.get(random.nextInt(intersections.size()));
        
        if (intersection.direction.equals("HORIZONTAL")) {
            placeWordHorizontally(grid, word, intersection.row, 
                intersection.col - intersection.wordIndex, wordPositions, wordNumber);
        } else {
            placeWordVertically(grid, word, intersection.row - intersection.wordIndex,
                intersection.col, wordPositions, wordNumber);
        }
    }

    private void placeWordHorizontally(String[][] grid, CrossWordGameWord word, int row, int col, 
            List<Map<String, Object>> wordPositions, int wordNumber) {
        String wordStr = word.getWord().toLowerCase();
        
        // 모든 글자를 알파벳으로 표시
        for (int i = 0; i < wordStr.length(); i++) {
            grid[row][col + i] = String.valueOf(wordStr.charAt(i));
        }
        
        Map<String, Object> position = new HashMap<>();
        position.put("word", wordStr);
        position.put("description", word.getDescription());
        position.put("startRow", row);
        position.put("startCol", col);
        position.put("direction", "HORIZONTAL");
        position.put("number", wordNumber);
        position.put("length", wordStr.length());
        wordPositions.add(position);
    }

    private static class IntersectionPoint {
        int row, col, wordIndex;
        String direction;

        IntersectionPoint(int row, int col, int wordIndex, String direction) {
            this.row = row;
            this.col = col;
            this.wordIndex = wordIndex;
            this.direction = direction;
        }
    }

    private List<IntersectionPoint> findIntersections(String[][] grid, String word) {
        List<IntersectionPoint> intersections = new ArrayList<>();
        word = word.toLowerCase();

        // 그리드를 순회하면서 교차점 찾기
        for (int row = 1; row < grid.length - 1; row++) {
            for (int col = 1; col < grid[0].length - 1; col++) {
                String cell = grid[row][col];
                if (!cell.isEmpty() && !cell.matches("\\d+")) {  // 알파벳이 있는 칸
                    // 현재 칸의 알파벳과 일치하는 위치 찾기
                    for (int i = 0; i < word.length(); i++) {
                        if (word.charAt(i) == cell.charAt(0)) {
                            // 세로 배치 시도
                            if (row >= i && row + (word.length() - i) < grid.length - 1) {
                                if (canPlaceVertically(grid, word, row - i, col)) {
                                    intersections.add(new IntersectionPoint(row - i, col, i, "VERTICAL"));
                                }
                            }
                            // 가로 배치 시도
                            if (col >= i && col + (word.length() - i) < grid[0].length - 1) {
                                if (canPlaceHorizontally(grid, word, row, col - i)) {
                                    intersections.add(new IntersectionPoint(row, col - i, i, "HORIZONTAL"));
                                }
                            }
                        }
                    }
                }
            }
        }
        return intersections;
    }

    private boolean isPartOfHorizontalWord(String[][] grid, int row, int col) {
        // 왼쪽이나 오른쪽에 알파벳이 있으면 가로 단어의 일부
        return (col > 0 && !grid[row][col-1].isEmpty() && !grid[row][col-1].matches("\\d+")) ||
               (col < grid[0].length-1 && !grid[row][col+1].isEmpty() && !grid[row][col+1].matches("\\d+"));
    }

    private boolean isPartOfVerticalWord(String[][] grid, int row, int col) {
        // 위나 아래에 알파벳이 있으면 세로 단어의 일부
        return (row > 0 && !grid[row-1][col].isEmpty() && !grid[row-1][col].matches("\\d+")) ||
               (row < grid.length-1 && !grid[row+1][col].isEmpty() && !grid[row+1][col].matches("\\d+"));
    }

    private boolean canPlaceHorizontally(String[][] grid, String word, int row, int startCol) {
        if (startCol < 1 || startCol + word.length() >= grid[0].length - 1) return false;
        
        // 단어 앞뒤는 비어있어야 함
        if (!grid[row][startCol-1].isEmpty() || !grid[row][startCol + word.length()].isEmpty()) {
            return false;
        }

        boolean hasIntersection = false;
        for (int i = 0; i < word.length(); i++) {
            String currentCell = grid[row][startCol + i];
            if (!currentCell.isEmpty()) {
                if (!currentCell.matches("\\d+") && currentCell.charAt(0) != word.charAt(i)) {
                    return false;
                }
                hasIntersection = true;
            } else {
                // 위아래에 다른 단어가 없어야 함
                if ((row > 0 && !grid[row-1][startCol + i].isEmpty()) ||
                    (row < grid.length-1 && !grid[row+1][startCol + i].isEmpty())) {
                    return false;
                }
            }
        }
        return true;
    }

    private boolean canPlaceVertically(String[][] grid, String word, int startRow, int col) {
        if (startRow < 1 || startRow + word.length() >= grid.length - 1) return false;
        
        // 단어 앞뒤는 비어있어야 함
        if (!grid[startRow-1][col].isEmpty() || !grid[startRow + word.length()][col].isEmpty()) {
            return false;
        }

        boolean hasIntersection = false;
        for (int i = 0; i < word.length(); i++) {
            String currentCell = grid[startRow + i][col];
            if (!currentCell.isEmpty()) {
                if (!currentCell.matches("\\d+") && currentCell.charAt(0) != word.charAt(i)) {
                    return false;
                }
                hasIntersection = true;
            } else {
                // 좌우에 다른 단어가 없어야 함
                if ((col > 0 && !grid[startRow + i][col-1].isEmpty()) ||
                    (col < grid[0].length-1 && !grid[startRow + i][col+1].isEmpty())) {
                    return false;
                }
            }
        }
        return true;
    }

    private void placeWordVertically(String[][] grid, CrossWordGameWord word, int row, int col, 
            List<Map<String, Object>> wordPositions, int wordNumber) {
        String wordStr = word.getWord().toLowerCase();
        
        // 모든 글자를 알파벳으로 표시
        for (int i = 0; i < wordStr.length(); i++) {
            grid[row + i][col] = String.valueOf(wordStr.charAt(i));
        }
        
        Map<String, Object> position = new HashMap<>();
        position.put("word", wordStr);
        position.put("description", word.getDescription());
        position.put("startRow", row);
        position.put("startCol", col);
        position.put("direction", "VERTICAL");
        position.put("number", wordNumber);
        position.put("length", wordStr.length());
        wordPositions.add(position);
    }

    private Map<String, Object> createWordPositionMap(CrossWordGameWord word, int row, int col, String direction) {
        Map<String, Object> position = new HashMap<>();
        position.put("word", word.getWord().toLowerCase());
        position.put("description", word.getDescription());
        position.put("startRow", row);
        position.put("startCol", col);
        position.put("direction", direction);
        return position;
    }

    public void addWord(CrossWordGameWord word) {
        word.setWord(word.getWord().toLowerCase());  // 단어를 소문자로 저장
        wordRepository.save(word);
    }

    // 단어 배치 시 검증 로직 추가
    private boolean canPlaceWord(String[][] grid, String word, int row, int col, boolean isHorizontal) {
        int length = word.length();
        
        // 단어 길이만큼 공간이 있는지 확인
        if (isHorizontal && col + length > grid[0].length) return false;
        if (!isHorizontal && row + length > grid.length) return false;
        
        // 단어를 놓을 위치 검증
        for (int i = 0; i < length; i++) {
            int currentRow = isHorizontal ? row : row + i;
            int currentCol = isHorizontal ? col + i : col;
            
            // 현재 위치에 다른 글자가 있는 경우
            if (!grid[currentRow][currentCol].equals("-") && 
                !grid[currentRow][currentCol].equals(String.valueOf(word.charAt(i)))) {
                return false;
            }
            
            // 주변 셀 검사 (교차점이 아닌 경우 인접한 셀에 글자가 없어야 함)
            if (!checkAdjacentCells(grid, currentRow, currentCol, isHorizontal)) {
                return false;
            }
        }
        return true;
    }
    
    private boolean checkAdjacentCells(String[][] grid, int row, int col, boolean isHorizontal) {
        // 가로 단어의 경우 위아래 셀 확인
        if (isHorizontal) {
            if (row > 0 && !grid[row-1][col].equals("-")) return false;
            if (row < grid.length-1 && !grid[row+1][col].equals("-")) return false;
        }
        // 세로 단어의 경우 좌우 셀 확인
        else {
            if (col > 0 && !grid[row][col-1].equals("-")) return false;
            if (col < grid[0].length-1 && !grid[row][col+1].equals("-")) return false;
        }
        return true;
    }
}
