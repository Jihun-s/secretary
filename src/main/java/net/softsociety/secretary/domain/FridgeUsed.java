package net.softsociety.secretary.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FridgeUsed {

    private int fridgeUsedId;
    private int fridgeId;
    private int foodId;
    private String fridgeUsedDate;
    private int fridgeQuantityUsed;
    private String fridgeFoodName;
	
}
