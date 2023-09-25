package net.softsociety.secretary.domain;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LivingUsed {
    private int livingUsedId;
    private int familyId;
    private int itemId;
    private String itemName;
    private String itemCategory;
    private String livingUsedDate;
    private int livingQuantityUsed;
}
