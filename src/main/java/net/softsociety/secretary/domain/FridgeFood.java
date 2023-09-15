package net.softsociety.secretary.domain;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FridgeFood {

    private int foodId;
    private String foodName;
    private int fridgeId;
    private String fridgeName;
    private int foodQuantity;
    private String foodCategory;
    private String foodInputDate;
    private String foodPurchaseDate;
    private String foodMadeDate;
    private String foodExpiryDate;
    private Long foodPrice;
    private String foodOriginalFile;
    private String foodSavedFile;
    private String lastUsedDate;
}