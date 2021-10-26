# File Note

## customButton.v#.js

The customButton.v#.js is bundled javascript file by webpack with babel transfiler. You need just this file for using the button pattern library

## originalSource(folder)

This folder contained original source files of the pattern library that are unbundled.

This package do not need generally.

But, If you wanna fix the bug and wanna use this library for making fit your project, You need to fix these files and need work that re-bundling files you modified.

This package folder contained a "package.json" file that makes you're able to use the command "npm install" to set the bundling working environment on your computer.



## Update Log

CustomButton.v2.js가 업데이트되었습니다.

### 1. API 변경사항

커스텀 버튼의 기능을 구별하는 새로운 속성이 추가됩니다 : data-button-role 
이에 따라 기존에 있던 data-contentExpandable 속성은 더 이상 사용되지 않습니다.
값은 "switch"입니다.

※ 코멘트: expanded와 pressed를 동시에 줄 수 없도록 하기 위해, 효과적인 방법을 찾다가 속성을 통합하게 되었습니다.



### 2. API 추가

span 태그와 div태그, a 태그 객체에 다음 속성, 메소드가 추가됩니다.
- 메소드1: setItAsNormalButton( initDisabled );
  기본 버튼을 만드는 메소드입니다.
  - 파라미터 1: initDisabled : 활성화 상태의 기본값을 정합니다. 빈값으로 두면 false로 설정됩니다.

- 메소드2: setItAsSwitchButton( initDisabled, initPressed );
  토글버튼을 만드는 메소드입니다.
  - 파라미터 1: initDisabled : 활성화 상태의 기본값을 정합니다. 빈 값으로 두면 false로 설정됩니다.
  - 파라미터 2: initPressed : 확장축소 기본값을 정합니다. 빈 값으로 두면 false로 설정됩니다.

- 메소드3: setItAsAccordionButton( initExpanded, initDisabled, contentElementId );
 - 파라미터1: initDisabled : 활성화 상태의 기본값을 정합니다. 빈 값으로 두면 false로 설정됩니다.
 - 파라미터2: initExpanded : 확장축소 상태의 기본값을 정합니다. 빈 값으로 두면 false로 설정됩니다.
 - 파라미터3: contentElementId : HTML id를 텍스트로 전달하여 나타나고 사라질 콘텐츠를 선택합니다. 
   기본값은 nul로, 아이디값을 넣지 않고 생성한다면 cb.customElementInfo.setControlElement = element를 통해 지정해 줘야 합니다.

- 속성: isCustomButton
   new CustomButton이나 setItAs~Button 메소드로 생성된 버튼에 자동으로 isCustomButton 속성이 추가되며, 커스텀버튼이라면 true 값을 갖습니다.

※ 코멘트: DOM에서 조금 더 간편하게 사용할 수 있는 메소드가 필요하다고 생각되어 추가하게 되었습니다.



### 3. passive 스크립트 추가 안내

이번 버전부터 스크립트는 passive 파일과 active 파일로 나뉩니다.
passive는 스크립트를 불러오는 것 만으로 role="button"에 기능이 추가되지 않으며, CustomButtonAutoCreation();을 불러와야 active 버전처럼 마크업된 버튼에 기능이 추가됩니다.
기존의 파일은 active 파일이며, passive 파일은 .passive.js로 이름이 붙습니다.