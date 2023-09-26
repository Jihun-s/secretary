package net.softsociety.secretary.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;
import net.softsociety.secretary.dao.LivingGoodsDAO;
import net.softsociety.secretary.dao.LivingUsedDAO;
import net.softsociety.secretary.domain.LivingUsed;
import net.softsociety.secretary.domain.LivingGoods;

@Slf4j
@Service
public class LivingUsedServiceImpl implements LivingUsedService {

	@Autowired
	private LivingUsedDAO livingUsedDAO;
	@Autowired
	private LivingGoodsDAO livingGoodsDAO;
	
	@Override
	@Transactional
	public void consumeItem(LivingGoods livingGoods) {
		
		log.debug("서비스 임플 !!!!!!!!!!!!!!!!!!!!!!!!!! :{}",livingGoods);
		// 수량 확인
	    int currentQuantity = livingGoodsDAO.checkItemQuantity(livingGoods);
	    // 현재 수량이 소비하려는 수량보다 많거나 같다면
	    if (currentQuantity >= livingGoods.getItemQuantity()) {
	        // 수량 감소
	    	livingGoodsDAO.reduceItemQuantity(livingGoods);
	        
	        // 소비 이력 추가
	        LivingUsed livingUsed = new LivingUsed();
	        
	        livingUsed.setItemId(livingGoods.getItemId());
	        livingUsed.setFamilyId(livingGoods.getFamilyId());
	        livingUsed.setLivingQuantityUsed(livingGoods.getItemQuantity());
	        livingUsed.setItemCategory(livingGoods.getItemCategory());
	        livingUsed.setItemName(livingGoods.getItemName());
	        
	        try {
	            livingUsedDAO.insertUsedItem(livingUsed);
	        } catch (Exception e) {
	            log.error("Error inserting used food", e);
	        }

	        // 수량이 0이면 음식 삭제
	        if (currentQuantity - livingGoods.getItemQuantity() == 0) {
	            livingGoodsDAO.deleteLivingGoods(livingGoods.getItemId());
	        }
	    } else {
	        // 오류 처리 (예: 예외 발생)
	    }
	}

	@Override
	public List<LivingUsed> getUsedGoodsHistory() {
		return livingUsedDAO.getAllUsedItems();
	}

	@Override
	public List<LivingGoods> getLivingGoodsNotAccessedForDays(int days) {
	    return livingUsedDAO.getLivingGoodsNotAccessedForDays(days);
	}

	@Override
	public int deleteById(int fridgeUsedId) {
		return livingUsedDAO.deleteById(fridgeUsedId);
	}

	@Override
	public void deleteAll(int familyId) {
		livingUsedDAO.deleteAll(familyId);
	}
}
