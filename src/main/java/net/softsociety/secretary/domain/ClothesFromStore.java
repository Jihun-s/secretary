package net.softsociety.secretary.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ClothesFromStore {
	String clothesFromStoreName;
    String clothesFromStoreImg;
    String clothesFromStoreBrand;
    String clothesFromStoreCategory;
}
