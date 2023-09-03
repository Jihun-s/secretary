package net.softsociety.secretary.domain;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FridgeFoodListWrapper {
    private List<FridgeFood> fridgeFoods;
}
