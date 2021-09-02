import { ITranslate, IStyles } from '../interfaces';
import { TRANSLATE_CHROME_ADD_HOME_SCREEN } from '../constants';

export default function Chrome({translate, styles }: {
  translate: Partial<ITranslate>, styles: Partial<IStyles>,
}) {
  return <>
    {
      translate.headline ?
        <p className='heading' style={styles.heading}>{translate.headline}</p> : null
    }
    <p>
      {translate.chromiumAddHomeScreen || TRANSLATE_CHROME_ADD_HOME_SCREEN}
      {translate.bottomline ? <><br/>{translate.bottomline}</> : null}
    </p>
  </>
}
