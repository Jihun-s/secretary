package net.softsociety.secretary.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.softsociety.secretary.dao.LivingCategoryDAO;
import net.softsociety.secretary.dao.LivingGoodsDAO;
import net.softsociety.secretary.domain.LivingCategory;
import net.softsociety.secretary.domain.LivingGoods;

@Service
public class LivingGoodsServiceImpl implements LivingGoodsService {

	@Autowired
	private LivingGoodsDAO livingGoodsDAO;
	@Autowired
	private LivingCategoryDAO livingCategoryDAO;
	
	@Override
	public void addLivingGood(LivingGoods livingGood, int familyId) {
	    // 필요한 로직 (예: 유통기한 설정, 카테고리 확인 등)
	    livingGoodsDAO.insertLivingGood(livingGood);
	    
	    // 카테고리가 이미 존재하는지 확인
	    String category = livingGood.getItemCategory();
	    LivingCategory livingCategory = new LivingCategory();
	    livingCategory.setItemCategory(category);
	    livingCategory.setFamilyId(familyId);
	    // DEFAULT_CATEGORIES 리스트를 이용하여 미리 정의된 카테고리인지 확인
	    List<String> DEFAULT_CATEGORIES = Arrays.asList("욕실용품", "주방용품", "청소용품", "세탁용품", "일반물품", "사용자 입력", "custom"); // ... 등등 추가 가능

	    if (!livingCategoryDAO.exists(livingCategory) && !DEFAULT_CATEGORIES.contains(category)) {
	        // 카테고리가 존재하지 않고, 미리 정의된 카테고리도 아니면 새로운 카테고리 추가
	        livingCategoryDAO.addCategory(livingCategory);
	    }
	}

	@Override
	public List<LivingGoods> getLivingGoods() {
		return livingGoodsDAO.getLivingGoods();
	}
}
