
// app/components/CharacterSelect.jsx - モダンなキャラクター選択UI
'use client';

export default function CharacterSelect({ characters, selectedCharacter, onSelect }) {
  return (
    <div className="my-4 w-full mx-auto px-2 sm:px-0 sm:max-w-4xl">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
        <div className="p-1.5 mr-2 bg-amber-200 dark:bg-amber-900/50 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-amber-700 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span className="text-amber-800 dark:text-amber-300">
          お題を選択
        </span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {characters.map(character => (
          <div 
            key={character.id}
            onClick={() => onSelect(character)}
            className={`
              relative overflow-hidden rounded-md transition-all duration-200
              hover:scale-102 cursor-pointer
              ${selectedCharacter?.id === character.id 
                ? 'border-2 border-amber-500 dark:border-amber-600' 
                : 'border border-amber-200 dark:border-gray-600'
              }
              ${selectedCharacter?.id === character.id
                ? 'dark:bg-gray-800 bg-white shadow-md' 
                : 'dark:bg-gray-800 bg-white'
              }
            `}
          >
            <div className="aspect-square relative overflow-hidden p-2">
              <div className={`absolute inset-0 ${
                selectedCharacter?.id === character.id 
                  ? 'bg-amber-50 dark:bg-gray-800' 
                  : 'bg-white dark:bg-gray-800'
              }`}></div>
              <img 
                src={character.imageUrl} 
                alt={character.name} 
                className="object-contain w-full h-full p-4 relative z-10" 
              />
            </div>
            
            <div className={`
              py-2 px-3 text-center font-medium text-sm sm:text-base
              ${selectedCharacter?.id === character.id 
                ? 'bg-amber-500 text-white dark:bg-amber-600 dark:text-white' 
                : 'bg-amber-100 text-amber-800 dark:bg-gray-700 dark:text-amber-200'
              }
            `}>
              {character.name}
            </div>
            
            {selectedCharacter?.id === character.id && (
              <div className="absolute top-2 right-2 bg-amber-500 dark:bg-amber-600 text-white rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}