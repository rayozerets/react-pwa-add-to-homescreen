import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/index.css';

import Chromium from './Chromium';
import Safari from './Safari';
import Install from './Install';

import { getPlatform } from '../utils/platform';
import { setCookie, getCookieValue } from '../utils/cookie';

import { BeforeInstallPromptEvent, IProps, IInitData } from '../interfaces';
import { COOKIE_NAME, COOKIE_EXPIRE_DAYS } from '../constants';

export function AddToHomeScreen({ ...props }: IProps) {
  const [component, setComponent] = useState<JSX.Element | null>(null)
  const [eventInstall, setEventInstall] = useState<BeforeInstallPromptEvent>();
  const [initData, setInitData] = useState<IInitData>();
  const cookieName = (props.cookie.name || COOKIE_NAME);
  const expireDays = (props.cookie.expireDays || COOKIE_EXPIRE_DAYS);

  function handleBeforeInstallPrompt(event: Event) {
    event.preventDefault();
    setEventInstall(event as BeforeInstallPromptEvent);
  }

  function handleAppInstalled() {
    onCloseNotify(expireDays + 30);
  }

  function init() {
    if ('onbeforeinstallprompt' in window) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }
    if ('onappinstalled' in window) {
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    const platform = getPlatform();

    setTimeout(() => {
      const cookieVal = getCookieValue(cookieName);
      setInitData({ platform, openNotify: !cookieVal && platform !== 'standalone' });
    }, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    }
  }

  function onCloseNotify(cookieExpDays: number = 0) {
    setCookie(cookieName, cookieExpDays || expireDays);
    initData && setInitData({ ...initData, openNotify: false });
  }

  function onInstallApp(event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation();
    if (eventInstall) {
      eventInstall.prompt()
      .then(() => eventInstall.userChoice)
      .then((choiceResult) => choiceResult.outcome !== 'accepted' && onCloseNotify())
      .catch(() => onCloseNotify());
    } else {
      onCloseNotify();
    }
  }

  function renderComponent() {
    if (!initData || !initData.openNotify) {
      return setComponent(() => null);
    }

    setComponent(RenderHOC);
  }

  function RenderHOC() {
    return (
      <div
        className='add-to-home-screen-pwa'
        style={props.styles.body}
      >
        {eventInstall ? <RenderComponentInstall/> : <RenderComponentNotify/>}
      </div>
    )
  }

  function RenderComponentInstall() {
    return <div onClick={() => onCloseNotify()}>
      <Install onClick={onInstallApp} translate={props.translate} styles={props.styles}/>
    </div>;
  }

  function RenderComponentNotify() {
    let ComponentNotify = null;
    if (initData?.platform === 'chromium-android') {
      ComponentNotify = <Chromium translate={props.translate} styles={props.styles}/>;
    } else if (initData?.platform === 'iphone') {
      ComponentNotify = <Safari translate={props.translate} styles={props.styles}/>;
    }

    return ComponentNotify ? <div onClick={() => onCloseNotify()}>{ComponentNotify}</div> : null;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(init, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(renderComponent, [initData]);

  return <>{component}</>;
}

AddToHomeScreen.defaultProps = { cookie: {}, translate: {}, styles: {} }

AddToHomeScreen.propTypes = {
  cookie: PropTypes.shape({ name: PropTypes.string, expireDays: PropTypes.number }),
  translate: PropTypes.shape({
    headline: PropTypes.string,
    bottomline: PropTypes.string,
    tapShare: PropTypes.string,
    addHomeScreen: PropTypes.string,
    chromiumInstruction: PropTypes.string,
    chromiumInstall: PropTypes.string,
    buttonInstall: PropTypes.string,
  }),
  styles: PropTypes.shape({
    body: PropTypes.object,
    button: PropTypes.object,
    heading: PropTypes.object,
  })
}

// export default AddToHomeScreen;
