import { FunctionComponent } from 'react';
import { createPortal } from 'react-dom';
import { stopPropagation } from '../../lib/helpers';
import { usePrompt } from '../../store/hooks/prompt';

import Fade from '../animations/Fade';

import Icon from '../Icon';

import Button from '../Button';

import { ImportVideoForm } from './ImportVideoForm';
import PlaylistManager from './PlaylistManager';

const container = document.querySelector('#prompt');

const Prompt: FunctionComponent = () => {
    const [
        { isVisible, mode, headerText, confirmText, cancelText, callback },
        { closePrompt }
    ] = usePrompt();

    const handleConfirm = (data?: unknown) => {
        closePrompt();

        callback(data);
    };

    let confirmButtonProps;

    switch (mode) {
        case 'import':
            confirmButtonProps = {
                type: 'submit',
                form: 'importVideos'
            };
            break;

        case 'playlists':
            confirmButtonProps = {
                onClick: closePrompt
            };
            break;

        default:
            confirmButtonProps = {
                onClick: handleConfirm
            };
            break;
    }

    return container
        ? createPortal(
              <Fade
                  className="dialog__overlay"
                  onClick={closePrompt}
                  in={isVisible}
              >
                  <div
                      className="dialog shadow--2dp"
                      onClick={stopPropagation()}
                  >
                      <header className="dialog__header">
                          <Icon name="prompt" />

                          <span>{headerText}</span>
                      </header>

                      {mode === 'import' ? (
                          <div className="dialog__content">
                              <ImportVideoForm onSubmit={handleConfirm} />
                          </div>
                      ) : null}

                      {mode === 'playlists' ? (
                          <div className="dialog__content">
                              <PlaylistManager onClickItem={handleConfirm} />
                          </div>
                      ) : null}

                      <footer className="dialog__actions">
                          {cancelText ? (
                              <Button
                                  className="button button--close shadow--2dp"
                                  onClick={closePrompt}
                                  title={cancelText}
                              />
                          ) : null}

                          <Button
                              className="button shadow--2dp"
                              title={confirmText}
                              {...confirmButtonProps}
                          />
                      </footer>
                  </div>
              </Fade>,
              container
          )
        : null;
};

export default Prompt;
