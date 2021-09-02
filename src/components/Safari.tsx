import { ITranslate, IStyles } from '../interfaces';
import { TRANSLATE_SAFARI_TAP_SHARE, TRANSLATE_SAFARI_ADD_HOME_SCREEN } from '../constants';

export default function Safari({ translate, styles }: {
  translate: Partial<ITranslate>, styles: Partial<IStyles>
}) {
  return (
    <>
      {
        translate.headline ?
          <p className='heading' style={styles.heading}>{translate.headline}</p> : null
      }
      <p>
        {translate.safariTapShare || TRANSLATE_SAFARI_TAP_SHARE} <i className='share'></i>
        <br/>
        {translate.safariAddHomeScreen || TRANSLATE_SAFARI_ADD_HOME_SCREEN} <i className='home'></i>
        {translate.bottomline ? <><br/>{translate.bottomline}</> : null}
      </p>
    </>
  )
}
