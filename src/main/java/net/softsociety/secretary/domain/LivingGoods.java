package net.softsociety.secretary.domain;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LivingGoods {
    private int itemId;
    private String itemName;
    private String itemCategory;
    private int itemQuantity;
    private Double itemPrice;
    private String itemInputDate;
    private String itemPurchaseDate;
    private String itemMadeDate;
    private String itemExpiryDate;
    private String itemOriginalFile;
    private String itemSavedFile;
}
