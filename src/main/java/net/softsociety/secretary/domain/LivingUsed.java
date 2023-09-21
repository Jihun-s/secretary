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
    private int categoryId;
    private String itemName;
    private String livingUsedDate;
    private int livingQuantityUsed;
}
