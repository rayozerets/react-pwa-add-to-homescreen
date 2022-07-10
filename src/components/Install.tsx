import { ITranslate, IStyles } from '../interfaces';
import { TRANSLATE_INSTALL_BUTTON, TRANSLATE_CHROME_INSTALL } from '../constants';

export default function Install({ translate, onClick, styles }: {
  translate: Partial<ITranslate>,
  onClick: (event: React.MouseEvent<HTMLElement>) => void,
  styles: Partial<IStyles>
}) {
  return <>
    {
      translate.headline ?
        <p className='heading' style={styles.heading}>{translate.headline}</p> : null
    }
    <p>{translate.chromiumInstall || TRANSLATE_CHROME_INSTALL}</p>
    <button
      onClick={onClick}
      style={styles.button}
    >
      {translate.buttonInstall || TRANSLATE_INSTALL_BUTTON}
    </button>
  </>
}
