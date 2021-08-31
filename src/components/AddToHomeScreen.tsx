import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/index.css';

import Chrome from './Chrome';
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
    const cookieVal = getCookieValue(cookieName);

    if (props.skipFirstVisit && !cookieVal) {
      setCookie(cookieName, expireDays, 'initialized');
      return;
    }

    const existInstall = 'onbeforeinstallprompt' in window;
    const timeoutInit = existInstall ? Math.max(1000, props.delayNotify)  : props.delayNotify;

    if (existInstall) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }
    if ('onappinstalled' in window) {
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    const platform = getPlatform();

    setTimeout(() => {
      const isSupported = !!(platform);
      const isNotNotify = cookieVal !== 'notified';
      setInitData({ platform, openNotify: isSupported && isNotNotify && platform !== 'standalone' });
    }, timeoutInit);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    }
  }

  function onCloseNotify(cookieExpDays: number = 0) {
    setCookie(cookieName, cookieExpDays || expireDays);
    if (initData) {
      setInitData({ ...initData, openNotify: false });
    }
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
    return <div
      className='add-to-home-screen-pwa__notify'
      onClick={() => onCloseNotify()}
    >
      <Install onClick={onInstallApp} translate={props.translate} styles={props.styles}/>
    </div>;
  }

  function RenderComponentNotify() {
    let ComponentNotify = null;
    if (initData?.platform === 'chrome-android') {
      ComponentNotify = <Chrome translate={props.translate} styles={props.styles}/>;
    } else if (initData?.platform === 'safari-iphone') {
      ComponentNotify = <Safari translate={props.translate} styles={props.styles}/>;
    }

    return ComponentNotify ? <div
      className='add-to-home-screen-pwa__notify'
      onClick={() => onCloseNotify()}
    >
      {ComponentNotify}
    </div> : null;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(init, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(renderComponent, [initData, eventInstall]);

  return <>{component}</>;
}

AddToHomeScreen.defaultProps = {
  delayNotify: 0, skipFirstVisit: true, cookie: {}, translate: {}, styles: {}
}

AddToHomeScreen.propTypes = {
  delayNotify: PropTypes.number,
  skipFirstVisit: PropTypes.bool,
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
