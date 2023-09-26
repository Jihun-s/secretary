package net.softsociety.secretary.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import net.softsociety.secretary.dao.LivingCategoryDAO;
import net.softsociety.secretary.dao.LivingGoodsDAO;
import net.softsociety.secretary.domain.LivingCategory;

@Service
public class LivingCategoryServiceImpl implements LivingCategoryService {

	@Autowired
	private LivingCategoryDAO livingCategoryDAO;
	@Autowired
	private LivingGoodsDAO livingGoodsDAO;
	
	@Override
	public List<LivingCategory> getAllCategoriesByFamily(int familyId) {
		return livingCategoryDAO.getAllCategoriesByFamily(familyId);
	}

	@Override
	public int addCategory(LivingCategory itemCategory) {
		return livingCategoryDAO.addCategory(itemCategory);
	}

	@Override
	public boolean checkCategoryDuplication(LivingCategory livingCategory) {
		return livingCategoryDAO.checkCategoryDuplication(livingCategory) > 0;
	}

	@Override
	public int countItemsUsingCategory(LivingCategory livingCategory) {
		return livingGoodsDAO.countItemsUsingCategory(livingCategory);
	}

	@Override
	@Transactional
	public void updateCategory(String originalName, String newName, int familyId) {
		livingCategoryDAO.updateCategoryName(originalName, newName, familyId);
		livingGoodsDAO.updateItemsCategoryName(originalName, newName, familyId);
		
	}

	@Override
	public void deleteCategory(String itemCategory, int familyId) {
		// 아이템 카테고리를 '일반용품'으로 변경
		livingGoodsDAO.updateItemsCategoryName(itemCategory, "일반용품", familyId);
		
		LivingCategory livingCategory = new LivingCategory();
		livingCategory.setFamilyId(familyId);
		livingCategory.setItemCategory(itemCategory);
		// 카테고리 삭제
		livingCategoryDAO.deleteCategory(livingCategory);
	}

}
