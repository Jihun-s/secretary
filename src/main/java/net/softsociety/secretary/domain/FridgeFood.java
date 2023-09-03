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
    private int foodQuantity;
    private String foodCategory;
    private Date foodInputDate;
    private Date foodMadeDate;
    private Date foodExpiryDate;
    private Long foodPrice;
    private String foodOriginalFile;
    private String foodSavedFile;
}