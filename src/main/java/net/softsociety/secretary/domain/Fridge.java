package net.softsociety.secretary.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fridge {
	private int fridgeId;
	private int familyId;
	private String fridgeName;
	private String fridgeCategory;
	private String currentFridgeName;
}
