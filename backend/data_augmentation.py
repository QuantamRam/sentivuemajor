import random
import logging
from typing import List

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SentimentDataAugmenter:
    """
    NLP Data Augmentation utilities to balance sentiment datasets.
    """
    def __init__(self, use_synonym_replacement: bool = True):
        self.use_synonym_replacement = use_synonym_replacement
        # Mock synonym dictionary for demonstration
        self.synonyms = {
            "good": ["excellent", "great", "positive", "fine", "superb"],
            "bad": ["terrible", "awful", "negative", "poor", "substandard"],
            "happy": ["joyful", "cheerful", "content", "delighted"],
            "sad": ["depressed", "unhappy", "sorrowful", "gloomy"],
            "love": ["adore", "cherish", "appreciate"],
            "hate": ["despise", "dislike", "loathe"]
        }

    def replace_synonyms(self, text: str, max_replacements: int = 2) -> str:
        """
        Replaces words in the text with their synonyms to create a new training example.
        """
        words = text.split()
        replaceable = [i for i, w in enumerate(words) if w.lower() in self.synonyms]
        
        if not replaceable:
            return text
            
        random.shuffle(replaceable)
        replacements_made = 0
        
        for idx in replaceable:
            if replacements_made >= max_replacements:
                break
            original_word = words[idx].lower()
            new_word = random.choice(self.synonyms[original_word])
            # Match capitalization if possible
            if words[idx].istitle():
                new_word = new_word.title()
            elif words[idx].isupper():
                new_word = new_word.upper()
                
            words[idx] = new_word
            replacements_made += 1
            
        return " ".join(words)

    def generate_augmented_batch(self, dataset: List[str], augmentation_factor: int = 2) -> List[str]:
        """
        Generates an augmented dataset by multiplying the dataset size by the augmentation_factor.
        """
        logger.info(f"Augmenting dataset of size {len(dataset)} with factor {augmentation_factor}x")
        augmented_data = list(dataset)
        
        for _ in range(augmentation_factor - 1):
            for text in dataset:
                new_text = self.replace_synonyms(text)
                if new_text != text:
                    augmented_data.append(new_text)
                    
        logger.info(f"Augmentation complete. New dataset size: {len(augmented_data)}")
        return augmented_data

if __name__ == "__main__":
    augmenter = SentimentDataAugmenter()
    sample_texts = [
        "I love this product, it is really good.",
        "The experience was bad and I am sad.",
        "I hate the new update, terrible design."
    ]
    
    augmented = augmenter.generate_augmented_batch(sample_texts, augmentation_factor=3)
    for text in augmented:
        print(text)
