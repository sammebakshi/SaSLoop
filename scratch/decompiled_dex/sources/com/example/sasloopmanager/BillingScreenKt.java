package com.example.sasloopmanager;

import android.content.Context;
import android.widget.Toast;
import androidx.compose.foundation.BackgroundKt;
import androidx.compose.foundation.BorderKt;
import androidx.compose.foundation.BorderStroke;
import androidx.compose.foundation.BorderStrokeKt;
import androidx.compose.foundation.ClickableKt;
import androidx.compose.foundation.OverscrollEffect;
import androidx.compose.foundation.ScrollKt;
import androidx.compose.foundation.gestures.FlingBehavior;
import androidx.compose.foundation.interaction.MutableInteractionSource;
import androidx.compose.foundation.layout.Arrangement;
import androidx.compose.foundation.layout.BoxKt;
import androidx.compose.foundation.layout.BoxScope;
import androidx.compose.foundation.layout.BoxScopeInstance;
import androidx.compose.foundation.layout.ColumnKt;
import androidx.compose.foundation.layout.ColumnScope;
import androidx.compose.foundation.layout.ColumnScopeInstance;
import androidx.compose.foundation.layout.PaddingKt;
import androidx.compose.foundation.layout.PaddingValues;
import androidx.compose.foundation.layout.RowKt;
import androidx.compose.foundation.layout.RowScope;
import androidx.compose.foundation.layout.RowScopeInstance;
import androidx.compose.foundation.layout.SizeKt;
import androidx.compose.foundation.layout.SpacerKt;
import androidx.compose.foundation.lazy.LazyDslKt;
import androidx.compose.foundation.lazy.LazyItemScope;
import androidx.compose.foundation.lazy.LazyListScope;
import androidx.compose.foundation.lazy.LazyListState;
import androidx.compose.foundation.lazy.grid.LazyGridScope;
import androidx.compose.foundation.shape.CornerBasedShape;
import androidx.compose.foundation.shape.RoundedCornerShapeKt;
import androidx.compose.foundation.text.BasicTextFieldKt;
import androidx.compose.foundation.text.KeyboardActions;
import androidx.compose.foundation.text.KeyboardOptions;
import androidx.compose.foundation.text.TextAutoSize;
import androidx.compose.foundation.text.selection.TextSelectionColors;
import androidx.compose.material.icons.Icons;
import androidx.compose.material.icons.filled.AccountBalanceWalletKt;
import androidx.compose.material.icons.filled.AppsKt;
import androidx.compose.material.icons.filled.ArrowBackKt;
import androidx.compose.material.icons.filled.BookmarkBorderKt;
import androidx.compose.material.icons.filled.CloseKt;
import androidx.compose.material.icons.filled.HistoryKt;
import androidx.compose.material.icons.filled.ListKt;
import androidx.compose.material.icons.filled.LocalOfferKt;
import androidx.compose.material.icons.filled.NoteAddKt;
import androidx.compose.material.icons.filled.PersonKt;
import androidx.compose.material.icons.filled.RedeemKt;
import androidx.compose.material.icons.filled.RestaurantKt;
import androidx.compose.material.icons.filled.RoomServiceKt;
import androidx.compose.material.icons.filled.SearchKt;
import androidx.compose.material.icons.filled.ShoppingCartKt;
import androidx.compose.material3.AndroidMenu_androidKt;
import androidx.compose.material3.ButtonColors;
import androidx.compose.material3.ButtonDefaults;
import androidx.compose.material3.ButtonElevation;
import androidx.compose.material3.ButtonKt;
import androidx.compose.material3.CardColors;
import androidx.compose.material3.CardDefaults;
import androidx.compose.material3.CardElevation;
import androidx.compose.material3.CardKt;
import androidx.compose.material3.DividerKt;
import androidx.compose.material3.IconButtonColors;
import androidx.compose.material3.IconButtonKt;
import androidx.compose.material3.IconKt;
import androidx.compose.material3.MaterialTheme;
import androidx.compose.material3.MenuItemColors;
import androidx.compose.material3.OutlinedTextFieldDefaults;
import androidx.compose.material3.OutlinedTextFieldKt;
import androidx.compose.material3.ProgressIndicatorKt;
import androidx.compose.material3.SurfaceKt;
import androidx.compose.material3.TabKt;
import androidx.compose.material3.TabRowKt;
import androidx.compose.material3.TextFieldColors;
import androidx.compose.material3.TextKt;
import androidx.compose.runtime.Applier;
import androidx.compose.runtime.Composable;
import androidx.compose.runtime.ComposableInferredTarget;
import androidx.compose.runtime.ComposableTarget;
import androidx.compose.runtime.ComposablesKt;
import androidx.compose.runtime.Composer;
import androidx.compose.runtime.ComposerKt;
import androidx.compose.runtime.CompositionLocal;
import androidx.compose.runtime.CompositionLocalMap;
import androidx.compose.runtime.EffectsKt;
import androidx.compose.runtime.MutableState;
import androidx.compose.runtime.RecomposeScopeImplKt;
import androidx.compose.runtime.ScopeUpdateScope;
import androidx.compose.runtime.SnapshotMutationPolicy;
import androidx.compose.runtime.SnapshotStateKt;
import androidx.compose.runtime.State;
import androidx.compose.runtime.Updater;
import androidx.compose.runtime.internal.ComposableLambdaKt;
import androidx.compose.runtime.snapshots.SnapshotStateMap;
import androidx.compose.ui.Alignment;
import androidx.compose.ui.ComposedModifierKt;
import androidx.compose.ui.Modifier;
import androidx.compose.ui.draw.ClipKt;
import androidx.compose.ui.graphics.Color;
import androidx.compose.ui.graphics.Shadow;
import androidx.compose.ui.graphics.Shape;
import androidx.compose.ui.graphics.SolidColor;
import androidx.compose.ui.graphics.drawscope.DrawStyle;
import androidx.compose.ui.graphics.vector.ImageVector;
import androidx.compose.ui.layout.MeasurePolicy;
import androidx.compose.ui.node.ComposeUiNode;
import androidx.compose.ui.platform.AndroidCompositionLocals_androidKt;
import androidx.compose.ui.semantics.Role;
import androidx.compose.ui.text.PlatformTextStyle;
import androidx.compose.ui.text.TextStyle;
import androidx.compose.ui.text.font.FontFamily;
import androidx.compose.ui.text.font.FontStyle;
import androidx.compose.ui.text.font.FontSynthesis;
import androidx.compose.ui.text.font.FontWeight;
import androidx.compose.ui.text.input.VisualTransformation;
import androidx.compose.ui.text.intl.LocaleList;
import androidx.compose.ui.text.style.BaselineShift;
import androidx.compose.ui.text.style.LineHeightStyle;
import androidx.compose.ui.text.style.TextAlign;
import androidx.compose.ui.text.style.TextDecoration;
import androidx.compose.ui.text.style.TextGeometricTransform;
import androidx.compose.ui.text.style.TextIndent;
import androidx.compose.ui.text.style.TextMotion;
import androidx.compose.ui.text.style.TextOverflow;
import androidx.compose.ui.unit.Dp;
import androidx.compose.ui.unit.TextUnitKt;
import androidx.compose.ui.window.AndroidDialog_androidKt;
import androidx.compose.ui.window.DialogProperties;
import com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$12$0$0$1$0$;
import com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$20$0$0$7$0$;
import com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$20$0$0$9$0$;
import com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$34$0$0$13$0$;
import com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$5$0$0$;
import com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$5$1$0$;
import com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$6$1$3$3$0$;
import com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$6$2$3$1$0$;
import com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$6$3$2$1$0$;
import com.example.sasloopmanager.BillingScreenKt$parsePhoneNumber$;
import com.example.sasloopmanager.ComposableSingletons;
import com.example.sasloopmanager.data.CategoryItem;
import com.example.sasloopmanager.data.CustomerHistoryResponse;
import com.example.sasloopmanager.data.MenuItem;
import com.example.sasloopmanager.data.OptionGroup;
import com.example.sasloopmanager.data.OptionItem;
import com.example.sasloopmanager.data.Order;
import com.example.sasloopmanager.data.PosSettings;
import com.example.sasloopmanager.data.SearchedCustomer;
import com.example.sasloopmanager.data.SelectedModifier;
import com.example.sasloopmanager.data.StaffUser;
import com.example.sasloopmanager.data.TableItem;
import com.example.sasloopmanager.data.UserProfile;
import com.example.sasloopmanager.theme.ColorKt;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import kotlin.Metadata;
import kotlin.Triple;
import kotlin.Unit;
import kotlin.collections.CollectionsKt;
import kotlin.collections.IntIterator;
import kotlin.coroutines.Continuation;
import kotlin.jvm.functions.Function0;
import kotlin.jvm.functions.Function1;
import kotlin.jvm.functions.Function2;
import kotlin.jvm.functions.Function3;
import kotlin.jvm.functions.Function4;
import kotlin.jvm.internal.DefaultConstructorMarker;
import kotlin.jvm.internal.Intrinsics;
import kotlin.jvm.internal.SourceDebugExtension;
import kotlin.jvm.internal.StringCompanionObject;
import kotlin.ranges.RangesKt;
import kotlin.text.StringsKt;
import org.jetbrains.annotations.NotNull;

/* compiled from: BillingScreen.kt */
@Metadata(d1 = {"\u0000ê\u0001\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u0006\n\u0000\n\u0002\u0010\b\n\u0000\n\u0002\u0010\u000b\n\u0002\b\u0006\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\t\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\r\n\u0002\u0018\u0002\n\u0002\b\u0006\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\f\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010$\n\u0002\b\u0007\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b-\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u000e\u001a!\u0010\u0000\u001a\u00020\u00012\u0006\u0010\u0002\u001a\u00020\u00032\n\b\u0002\u0010\u0004\u001a\u0004\u0018\u00010\u0005H\u0007¢\u0006\u0002\u0010\u0006\u001aG\u0010\u0007\u001a\u00020\u00012\b\b\u0002\u0010\b\u001a\u00020\t2\u0006\u0010\n\u001a\u00020\u000b2\u0006\u0010\f\u001a\u00020\u000b2\u0006\u0010\r\u001a\u00020\u000e2\u0006\u0010\u000f\u001a\u00020\u00102\f\u0010\u0011\u001a\b\u0012\u0004\u0012\u00020\u00010\u0012H\u0003¢\u0006\u0004\b\u0013\u0010\u0014\u001a\u008b\u0001\u0010\u0015\u001a\u00020\u00012\u0006\u0010\u0016\u001a\u00020\u00172\u0006\u0010\u0018\u001a\u00020\u000b2\b\u0010\u0019\u001a\u0004\u0018\u00010\u001a2\u0006\u0010\u001b\u001a\u00020\u001c2\f\u0010\u0011\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\u0006\u0010\u001d\u001a\u00020\u001e2\u0006\u0010\u001f\u001a\u00020\u001e2\u0006\u0010 \u001a\u00020\u000b2\u0006\u0010!\u001a\u00020\u001c2\u0006\u0010\"\u001a\u00020\u001e2\u0006\u0010#\u001a\u00020\u001e2\b\u0010$\u001a\u0004\u0018\u00010%2\b\u0010&\u001a\u0004\u0018\u00010'2\b\b\u0002\u0010(\u001a\u00020\u001eH\u0003¢\u0006\u0002\u0010)\u001a\u007f\u0010*\u001a\u00020\u00012\u0006\u0010+\u001a\u00020,2\u0006\u0010-\u001a\u00020\u001c2\u0006\u0010.\u001a\u00020\u001c2\f\u0010/\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\f\u00100\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\u0006\u00101\u001a\u00020\u001e2\u0006\u0010 \u001a\u00020\u000b2\u0006\u00102\u001a\u00020\u001e2\u0006\u0010!\u001a\u00020\u001c2\b\b\u0002\u00103\u001a\u00020\u001e2\b\b\u0002\u00104\u001a\u00020\u001e2\b\b\u0002\u00105\u001a\u00020\u001eH\u0003¢\u0006\u0002\u00106\u001a\u0018\u00107\u001a\u00020\u000b2\u0006\u00108\u001a\u00020\u001a2\u0006\u00109\u001a\u00020:H\u0002\u001a=\u0010;\u001a\u00020\u00012\u0006\u0010<\u001a\u00020\u000b2\u0006\u0010=\u001a\u00020\u000b2\b\b\u0002\u0010>\u001a\u00020\u001e2\b\b\u0002\u0010?\u001a\u00020\u00102\b\b\u0002\u0010@\u001a\u00020AH\u0003¢\u0006\u0004\bB\u0010C\u001aY\u0010D\u001a\u00020\u00012\u0006\u0010+\u001a\u00020,2\f\u0010E\u001a\b\u0012\u0004\u0012\u00020G0F2\f\u0010H\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\u001e\u0010/\u001a\u001a\u0012\n\u0012\b\u0012\u0004\u0012\u00020J0F\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010I2\u0006\u0010 \u001a\u00020\u000bH\u0003¢\u0006\u0002\u0010K\u001a\"\u0010N\u001a\u0014\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u000b0O2\u0006\u0010P\u001a\u00020\u000bH\u0002\u001ae\u0010Q\u001a\u00020\u00012\u0006\u0010=\u001a\u00020\u000b2\u0012\u0010R\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010S2\u0006\u0010T\u001a\u00020\u000b2\b\b\u0002\u0010\b\u001a\u00020\t2\b\b\u0002\u0010U\u001a\u00020V2\b\b\u0002\u0010W\u001a\u00020\u001e2\b\b\u0002\u0010@\u001a\u00020A2\b\b\u0002\u0010X\u001a\u00020YH\u0003¢\u0006\u0004\bZ\u0010[\u001a\u001d\u0010\\\u001a\u00020\u00012\u0006\u0010]\u001a\u00020\u000b2\u0006\u0010^\u001a\u00020\u000bH\u0003¢\u0006\u0002\u0010_\u001a3\u0010`\u001a\u00020\u00012\u0006\u0010<\u001a\u00020\u000b2\u0006\u0010=\u001a\u00020\u000b2\b\b\u0002\u0010>\u001a\u00020\u001e2\b\b\u0002\u0010@\u001a\u00020AH\u0003¢\u0006\u0004\ba\u0010b\"\u0014\u0010L\u001a\b\u0012\u0004\u0012\u00020M0FX\u0082\u0004¢\u0006\u0002\n\u0000¨\u0006c²\u0006\u0010\u0010d\u001a\b\u0012\u0004\u0012\u00020,0FX\u008a\u0084\u0002²\u0006\u0010\u0010e\u001a\b\u0012\u0004\u0012\u00020f0FX\u008a\u0084\u0002²\u0006\n\u0010g\u001a\u00020\u000bX\u008a\u0084\u0002²\u0006\n\u0010h\u001a\u00020\u000bX\u008a\u0084\u0002²\u0006\u0016\u0010i\u001a\u000e\u0012\u0004\u0012\u00020,\u0012\u0004\u0012\u00020\u001c0jX\u008a\u0084\u0002²\u0006\u0016\u0010k\u001a\u000e\u0012\u0004\u0012\u00020,\u0012\u0004\u0012\u00020\u001c0jX\u008a\u0084\u0002²\u0006\u0010\u0010l\u001a\b\u0012\u0004\u0012\u00020\u00170FX\u008a\u0084\u0002²\u0006\u0010\u0010m\u001a\b\u0012\u0004\u0012\u00020%0FX\u008a\u0084\u0002²\u0006\u0016\u0010n\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u000b0jX\u008a\u0084\u0002²\u0006\u0016\u0010o\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020'0jX\u008a\u0084\u0002²\u0006\"\u0010p\u001a\u001a\u0012\u0004\u0012\u00020\u000b\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00020,\u0012\u0004\u0012\u00020\u001c0j0jX\u008a\u0084\u0002²\u0006\f\u0010q\u001a\u0004\u0018\u00010rX\u008a\u0084\u0002²\u0006\u0010\u0010s\u001a\b\u0012\u0004\u0012\u00020t0FX\u008a\u0084\u0002²\u0006\n\u0010u\u001a\u00020vX\u008a\u0084\u0002²\u0006\n\u0010w\u001a\u00020\u000bX\u008a\u0084\u0002²\u0006\f\u0010x\u001a\u0004\u0018\u00010\u0017X\u008a\u0084\u0002²\u0006\n\u0010y\u001a\u00020\u001eX\u008a\u0084\u0002²\u0006\f\u0010z\u001a\u0004\u0018\u00010\u000bX\u008a\u0084\u0002²\u0006\f\u0010{\u001a\u0004\u0018\u00010\u001eX\u008a\u0084\u0002²\u0006\f\u0010|\u001a\u0004\u0018\u00010\u001cX\u008a\u0084\u0002²\u0006\n\u00109\u001a\u00020:X\u008a\u0084\u0002²\u0006\u0010\u0010E\u001a\b\u0012\u0004\u0012\u00020G0FX\u008a\u0084\u0002²\u0006\n\u0010}\u001a\u00020\u001cX\u008a\u0084\u0002²\u0006\n\u0010~\u001a\u00020\u000bX\u008a\u0084\u0002²\u0006\f\u0010\u007f\u001a\u0004\u0018\u00010,X\u008a\u008e\u0002²\u0006\u000b\u0010\u0080\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0081\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0082\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0083\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0084\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0085\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0086\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0087\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0088\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0089\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u008a\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u008b\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u008c\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u008d\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u008e\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u008f\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\r\u0010\u0090\u0001\u001a\u0004\u0018\u00010\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0091\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u0092\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u0093\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u0094\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u0095\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u0096\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u0097\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u0098\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u0099\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u009a\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u009b\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u009c\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u009d\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u009e\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u009f\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010 \u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010¡\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010¢\u0001\u001a\u00020\u0010X\u008a\u0084\u0002²\u0006\f\u0010£\u0001\u001a\u00030¤\u0001X\u008a\u0084\u0002²\u0006\u000b\u0010¥\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u0012\u0010¦\u0001\u001a\t\u0012\u0005\u0012\u00030§\u00010FX\u008a\u0084\u0002²\u0006\u000b\u0010¨\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010©\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010ª\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010«\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u0012\u0010¬\u0001\u001a\t\u0012\u0005\u0012\u00030§\u00010FX\u008a\u0084\u0002²\u0006\u000b\u0010\u00ad\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010®\u0001\u001a\u00020\u001cX\u008a\u008e\u0002²\u0006\u000b\u0010¯\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010°\u0001\u001a\u00020\u001cX\u008a\u008e\u0002²\u0006\u000b\u0010±\u0001\u001a\u00020\u001cX\u008a\u008e\u0002²\u0006\u000b\u0010²\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010³\u0001\u001a\u00020\u001cX\u008a\u008e\u0002²\u0006\u0011\u0010´\u0001\u001a\b\u0012\u0004\u0012\u00020J0FX\u008a\u008e\u0002²\u0006\u000b\u0010µ\u0001\u001a\u00020\u000bX\u008a\u008e\u0002"}, d2 = {"BillingScreen", "", "billingViewModel", "Lcom/example/sasloopmanager/BillingViewModel;", "user", "Lcom/example/sasloopmanager/data/UserProfile;", "(Lcom/example/sasloopmanager/BillingViewModel;Lcom/example/sasloopmanager/data/UserProfile;Landroidx/compose/runtime/Composer;II)V", "FlowCard", "modifier", "Landroidx/compose/ui/Modifier;", "title", "", "subtext", "icon", "Landroidx/compose/ui/graphics/vector/ImageVector;", "iconColor", "Landroidx/compose/ui/graphics/Color;", "onClick", "Lkotlin/Function0;", "FlowCard-FHprtrg", "(Landroidx/compose/ui/Modifier;Ljava/lang/String;Ljava/lang/String;Landroidx/compose/ui/graphics/vector/ImageVector;JLkotlin/jvm/functions/Function0;Landroidx/compose/runtime/Composer;II)V", "TableCard", "table", "Lcom/example/sasloopmanager/data/TableItem;", "status", "orderTotal", "", "orderItemsCount", "", "showBillDetails", "", "showOrderStatus", "currency", "decimalPlaces", "showKOTNoOnTable", "displayTimeOnTable", "activeOrder", "Lcom/example/sasloopmanager/data/Order;", "activeTimestamp", "", "isSelected", "(Lcom/example/sasloopmanager/data/TableItem;Ljava/lang/String;Ljava/lang/Double;ILkotlin/jvm/functions/Function0;ZZLjava/lang/String;IZZLcom/example/sasloopmanager/data/Order;Ljava/lang/Long;ZLandroidx/compose/runtime/Composer;III)V", "MenuItemCard", "item", "Lcom/example/sasloopmanager/data/MenuItem;", "qtyInCart", "punchedQty", "onAdd", "onRemove", "isCompact", "showItemCodeDetails", "showItemImage", "showItemsDetails", "showItemsPrepTime", "(Lcom/example/sasloopmanager/data/MenuItem;IILkotlin/jvm/functions/Function0;Lkotlin/jvm/functions/Function0;ZLjava/lang/String;ZIZZZLandroidx/compose/runtime/Composer;III)V", "formatPrice", "price", "posSettings", "Lcom/example/sasloopmanager/data/PosSettings;", "ReceiptRow", "label", "value", "isBold", "color", "fontSize", "Landroidx/compose/ui/unit/TextUnit;", "ReceiptRow-6jM-SoI", "(Ljava/lang/String;Ljava/lang/String;ZJJLandroidx/compose/runtime/Composer;II)V", "ItemCustomizationDialog", "optionGroups", "", "Lcom/example/sasloopmanager/data/OptionGroup;", "onDismiss", "Lkotlin/Function2;", "Lcom/example/sasloopmanager/data/SelectedModifier;", "(Lcom/example/sasloopmanager/data/MenuItem;Ljava/util/List;Lkotlin/jvm/functions/Function0;Lkotlin/jvm/functions/Function2;Ljava/lang/String;Landroidx/compose/runtime/Composer;I)V", "countryCodes", "Lcom/example/sasloopmanager/CountryCodeItem;", "parsePhoneNumber", "Lkotlin/Triple;", "fullPhone", "CompactTextField", "onValueChange", "Lkotlin/Function1;", "placeholder", "keyboardOptions", "Landroidx/compose/foundation/text/KeyboardOptions;", "singleLine", "shape", "Landroidx/compose/foundation/shape/CornerBasedShape;", "CompactTextField-03iij_k", "(Ljava/lang/String;Lkotlin/jvm/functions/Function1;Ljava/lang/String;Landroidx/compose/ui/Modifier;Landroidx/compose/foundation/text/KeyboardOptions;ZJLandroidx/compose/foundation/shape/CornerBasedShape;Landroidx/compose/runtime/Composer;II)V", "ThermalGridRow", "left", "right", "(Ljava/lang/String;Ljava/lang/String;Landroidx/compose/runtime/Composer;I)V", "ThermalReceiptRow", "ThermalReceiptRow-JHQioms", "(Ljava/lang/String;Ljava/lang/String;ZJLandroidx/compose/runtime/Composer;II)V", "app", "catalog", "categories", "Lcom/example/sasloopmanager/data/CategoryItem;", "selectedCategory", "searchQuery", "cart", "", "oldKotItems", "tables", "activeOrders", "tableStatuses", "tableActiveTimestamps", "tableCarts", "customerHistory", "Lcom/example/sasloopmanager/data/CustomerHistoryResponse;", "staffList", "Lcom/example/sasloopmanager/data/StaffUser;", "flowState", "Lcom/example/sasloopmanager/BillingFlowState;", "activeFlow", "selectedTable", "isLoading", "error", "orderSuccess", "editingOrderId", "selectedPriceTier", "currentOrderType", "selectedItemForModifiers", "activeSubTab", "foodTypeFilter", "selectedDepartment", "customerName", "customerPhone", "customerAddress", "orderType", "paymentMethod", "discountInput", "serviceChargeInput", "deliveryChargeInput", "preOrderIdInput", "advancePaidInput", "kotNote", "coversCount", "ebillEnabled", "selectedWaiter", "isComplimentaryOrder", "showDiscountDialog", "showChargesDialog", "showWaiterDialog", "showHistoryDialog", "showPreviewDialog", "showCustomerDialog", "showNoteDialog", "showPaymentDialog", "showOldKotDialog", "showSplitBillDialog", "showCategoryMenu", "selectedDialCode", "selectedCountryFlag", "selectedCountryCode", "showCountryDropdown", "hasAutoRedirected", "trackColor", "thumbOffset", "Landroidx/compose/ui/unit/Dp;", "qtyText", "searchResults", "Lcom/example/sasloopmanager/data/SearchedCustomer;", "discountVal", "phoneVal", "nameVal", "addressVal", "dialogSearchResults", "noteVal", "historyTab", "selectAllOldKot", "splitTab", "portions", "percentInput", "ticks", "selectedModifiers", "kitchenNote"}, k = 2, mv = {2, 3, 0}, xi = 48)
@SourceDebugExtension({"SMAP\nBillingScreen.kt\nKotlin\n*S Kotlin\n*F\n+ 1 BillingScreen.kt\ncom/example/sasloopmanager/BillingScreenKt\n+ 2 Composer.kt\nandroidx/compose/runtime/ComposerKt\n+ 3 _Collections.kt\nkotlin/collections/CollectionsKt___CollectionsKt\n+ 4 fake.kt\nkotlin/jvm/internal/FakeKt\n+ 5 CompositionLocal.kt\nandroidx/compose/runtime/CompositionLocal\n+ 6 _Maps.kt\nkotlin/collections/MapsKt___MapsKt\n+ 7 Box.kt\nandroidx/compose/foundation/layout/BoxKt\n+ 8 Layout.kt\nandroidx/compose/ui/layout/LayoutKt\n+ 9 Composables.kt\nandroidx/compose/runtime/ComposablesKt\n+ 10 Column.kt\nandroidx/compose/foundation/layout/ColumnKt\n+ 11 Dp.kt\nandroidx/compose/ui/unit/DpKt\n+ 12 Row.kt\nandroidx/compose/foundation/layout/RowKt\n+ 13 LazyDsl.kt\nandroidx/compose/foundation/lazy/LazyDslKt\n+ 14 LazyGridDsl.kt\nandroidx/compose/foundation/lazy/grid/LazyGridDslKt\n+ 15 SnapshotState.kt\nandroidx/compose/runtime/SnapshotStateKt__SnapshotStateKt\n+ 16 Maps.kt\nkotlin/collections/MapsKt__MapsKt\n+ 17 ImageRequest.kt\ncoil/request/ImageRequest$Builder\n*L\n1#1,4606:1\n1128#2,6:4607\n1128#2,3:4613\n1131#2,3:4619\n1128#2,3:4622\n1131#2,3:4626\n1128#2,6:4629\n1128#2,6:4635\n1128#2,6:4641\n1128#2,6:4647\n1128#2,6:4653\n1128#2,6:4659\n1128#2,6:4665\n1128#2,6:4671\n1128#2,6:4677\n1128#2,6:4683\n1128#2,6:4689\n1128#2,6:4695\n1128#2,6:4701\n1128#2,6:4708\n1128#2,6:4714\n1128#2,6:4720\n1128#2,6:4726\n1128#2,6:4732\n1128#2,6:4738\n1128#2,6:4744\n1128#2,6:4750\n1128#2,6:4756\n1128#2,6:4762\n1128#2,6:4768\n1128#2,6:4774\n1128#2,6:4780\n1128#2,6:4786\n1128#2,6:4792\n1128#2,6:4798\n1128#2,6:4804\n1128#2,6:4810\n1128#2,6:4816\n1128#2,6:4822\n1128#2,3:4828\n1131#2,3:4833\n1128#2,6:4836\n1128#2,6:4842\n1128#2,6:4848\n1128#2,6:4854\n1128#2,3:4863\n1131#2,3:4868\n1128#2,6:4871\n1128#2,6:5003\n1128#2,6:5085\n1128#2,6:5091\n1128#2,6:5097\n1128#2,6:5207\n1128#2,6:5213\n1128#2,6:5255\n1128#2,6:5261\n1128#2,3:5314\n1131#2,3:5331\n1128#2,3:5334\n1131#2,3:5340\n1128#2,6:5377\n1128#2,6:5386\n1128#2,6:5493\n1128#2,6:5534\n1128#2,6:5540\n1128#2,6:5548\n1128#2,6:5554\n1128#2,3:5605\n1131#2,3:5611\n1128#2,6:5647\n1128#2,6:5828\n1128#2,6:5880\n1128#2,6:5955\n1128#2,6:5962\n1128#2,6:5972\n1128#2,6:5989\n1128#2,6:6034\n1128#2,6:6073\n1128#2,6:6188\n1128#2,6:6227\n1128#2,6:6235\n1128#2,6:6243\n1128#2,6:6320\n1128#2,6:6401\n1128#2,6:6445\n1128#2,6:6453\n1128#2,6:6463\n1128#2,6:6469\n1128#2,6:6476\n1128#2,6:6483\n1128#2,6:6524\n1128#2,6:6531\n1128#2,6:6573\n1128#2,6:6579\n1128#2,6:6585\n1128#2,6:6701\n1128#2,6:6708\n1128#2,6:6821\n1128#2,6:6831\n1128#2,6:6950\n1128#2,6:6989\n1128#2,6:6997\n1128#2,6:7005\n1128#2,6:7013\n1128#2,6:7021\n1128#2,6:7029\n1128#2,6:7067\n1128#2,6:7184\n1128#2,6:7191\n1128#2,6:7198\n1128#2,6:7205\n1128#2,6:7286\n1128#2,6:7293\n1128#2,6:7300\n1128#2,6:7311\n1128#2,6:7329\n1128#2,6:7335\n1128#2,6:7341\n1128#2,6:7347\n1128#2,6:7353\n1128#2,6:7359\n1128#2,6:7365\n1128#2,6:7371\n1128#2,6:7377\n1128#2,6:7383\n1128#2,6:7389\n1128#2,6:7395\n1128#2,6:7401\n1128#2,6:7407\n1128#2,6:7413\n1128#2,6:7430\n1128#2,6:7436\n1128#2,6:7484\n1128#2,6:7490\n1128#2,3:7497\n1131#2,3:7503\n1128#2,6:7858\n1128#2,6:7866\n1128#2,6:8016\n1128#2,6:8045\n1128#2,6:8091\n1128#2,6:8123\n1128#2,6:8129\n1128#2,6:8135\n1128#2,6:8174\n1128#2,6:8180\n1128#2,6:8221\n1128#2,6:8301\n1128#2,6:8307\n1128#2,6:8386\n1128#2,6:8433\n1128#2,6:8439\n1128#2,6:8445\n1128#2,6:8451\n1128#2,6:8490\n1128#2,6:8496\n1128#2,3:8553\n1131#2,3:8573\n1128#2,6:8578\n1128#2,6:8617\n1128#2,6:8623\n1128#2,6:8676\n1128#2,6:8722\n1128#2,6:8728\n1128#2,6:8734\n1128#2,6:8772\n1128#2,6:8780\n1128#2,6:8790\n1128#2,6:8796\n1128#2,6:8835\n1128#2,6:8841\n1128#2,6:8888\n1128#2,6:8894\n1128#2,6:8933\n1128#2,6:8939\n1128#2,6:8983\n1128#2,6:8989\n1128#2,3:8995\n1131#2,3:9001\n1128#2,6:9077\n1128#2,6:9083\n1128#2,6:9126\n1128#2,6:9132\n1128#2,6:9168\n1128#2,6:9285\n1128#2,6:9329\n1128#2,6:9335\n1128#2,6:9410\n1128#2,6:9492\n1128#2,6:9572\n1128#2,6:9578\n1128#2,6:9882\n1128#2,6:9890\n1128#2,6:9935\n1128#2,6:9943\n1128#2,6:10053\n1128#2,6:10092\n1128#2,6:10131\n1128#2,6:10223\n1128#2,6:10293\n1128#2,6:10300\n1128#2,6:10312\n1128#2,6:10342\n1128#2,6:10348\n1128#2,6:10354\n1128#2,6:10396\n1128#2,6:10403\n1128#2,6:10477\n1128#2,6:10529\n1128#2,6:10567\n1128#2,6:10578\n1128#2,6:10586\n1128#2,6:10661\n1128#2,6:10667\n1128#2,6:10843\n1128#2,6:11093\n1128#2,6:11314\n1128#2,6:11491\n1128#2,6:11533\n1128#2,6:11781\n1128#2,6:11872\n1128#2,6:11883\n1807#3,3:4616\n777#3:4860\n873#3,2:4861\n1068#3:4866\n1068#3:4867\n1642#3,10:5317\n1915#3:5327\n1916#3:5329\n1652#3:5330\n777#3:5337\n873#3,2:5338\n1807#3,3:5608\n1915#3:5644\n1916#3:5689\n777#3:7500\n873#3,2:7501\n1080#3:7506\n1915#3:7865\n1916#3:7872\n1915#3:8042\n1916#3:8051\n1915#3:8090\n1916#3:8097\n1915#3:8218\n1916#3:8263\n1915#3:8383\n1916#3:8428\n777#3:8556\n873#3,2:8557\n1642#3,10:8559\n1915#3:8569\n1916#3:8571\n1652#3:8572\n1915#3:8675\n1916#3:8682\n1924#3,3:8998\n1915#3:9407\n1916#3:9452\n1915#3:9489\n1916#3:9534\n1924#3,3:9629\n1924#3,3:9632\n1786#3,3:9709\n1915#3,2:9846\n788#3:9961\n800#3:9962\n1924#3,2:9963\n801#3,2:9965\n1926#3:9967\n803#3:9968\n1586#3:9969\n1661#3,3:9970\n1807#3,3:9980\n1586#3:9983\n1661#3,3:9984\n1915#3:10475\n1916#3:10519\n777#3:11588\n873#3,2:11589\n1807#3,3:11591\n832#3:11594\n862#3,2:11595\n832#3:11597\n862#3,2:11598\n777#3:11600\n873#3,2:11601\n1915#3:11738\n1915#3:11740\n1915#3:11774\n1807#3,3:11775\n1916#3:11861\n1916#3:11866\n1916#3:11868\n1#4:4625\n1#4:5328\n1#4:8570\n75#5:4707\n75#5:7496\n75#5:9004\n75#5:11226\n221#6,2:4831\n70#7:4877\n67#7,9:4878\n70#7:5279\n68#7,8:5280\n77#7:5313\n70#7:5560\n68#7,8:5561\n77#7:5596\n70#7:5654\n68#7,8:5655\n77#7:5688\n70#7:5694\n67#7,9:5695\n70#7:5726\n68#7,8:5727\n77#7:5760\n70#7:5761\n68#7,8:5762\n77#7:5841\n70#7:5842\n68#7,8:5843\n77#7:5876\n70#7:5887\n67#7,9:5888\n77#7:5983\n77#7:5987\n70#7:6119\n67#7,9:6120\n70#7:6151\n68#7,8:6152\n77#7:6185\n77#7:6197\n70#7:6284\n66#7,10:6285\n70#7:6327\n68#7,8:6328\n77#7:6400\n77#7:6412\n70#7:6413\n67#7,9:6414\n77#7:6462\n70#7:6537\n68#7,8:6538\n77#7:6572\n70#7:6881\n67#7,9:6882\n70#7:6913\n68#7,8:6914\n77#7:6947\n77#7:6959\n77#7:7426\n70#7:7609\n66#7,10:7610\n77#7:7645\n70#7:7721\n68#7,8:7722\n77#7:7755\n70#7:7936\n68#7,8:7937\n77#7:7971\n70#7:8228\n68#7,8:8229\n77#7:8262\n70#7:8393\n68#7,8:8394\n77#7:8427\n70#7:8740\n67#7,9:8741\n77#7:8789\n70#7:9176\n68#7,8:9177\n77#7:9210\n70#7:9212\n68#7,8:9213\n77#7:9246\n70#7:9248\n68#7,8:9249\n77#7:9282\n70#7:9292\n68#7,8:9293\n77#7:9326\n70#7:9417\n68#7,8:9418\n77#7:9451\n70#7:9499\n68#7,8:9500\n77#7:9533\n70#7:9592\n66#7,10:9593\n77#7:9628\n70#7:9635\n66#7,10:9636\n77#7:9671\n70#7:9672\n66#7,10:9673\n77#7:9708\n70#7:9712\n66#7,10:9713\n77#7:9748\n70#7:10187\n68#7,8:10188\n77#7:10221\n70#7:10484\n68#7,8:10485\n77#7:10518\n70#7:10883\n68#7,8:10884\n77#7:10918\n70#7:10968\n67#7,9:10969\n77#7:11154\n70#7:11155\n66#7,10:11156\n77#7:11191\n70#7:11194\n67#7,9:11195\n77#7:11323\n70#7:11497\n68#7,8:11498\n77#7:11532\n70#7:11539\n68#7,8:11540\n77#7:11573\n70#7:11788\n67#7,9:11789\n77#7:11860\n70#7:11904\n68#7,8:11905\n77#7:11938\n81#8,6:4887\n88#8,6:4902\n81#8,6:4919\n88#8,6:4934\n81#8,6:4948\n88#8,6:4963\n81#8,6:4981\n88#8,6:4996\n81#8,6:5022\n88#8,6:5037\n96#8:5046\n96#8:5050\n81#8,6:5063\n88#8,6:5078\n96#8:5105\n96#8:5109\n81#8,6:5118\n88#8,6:5133\n81#8,6:5153\n88#8,6:5168\n81#8,6:5185\n88#8,6:5200\n96#8:5221\n81#8,6:5233\n88#8,6:5248\n96#8:5269\n96#8:5273\n96#8:5277\n81#8,6:5288\n88#8,6:5303\n96#8:5312\n81#8,6:5353\n88#8,6:5368\n96#8:5394\n81#8,6:5406\n88#8,6:5421\n81#8,6:5438\n88#8,6:5453\n81#8,6:5467\n88#8,6:5482\n81#8,6:5512\n88#8,6:5527\n81#8,6:5569\n88#8,6:5584\n96#8:5595\n96#8:5599\n96#8:5603\n81#8,6:5622\n88#8,6:5637\n81#8,6:5663\n88#8,6:5678\n96#8:5687\n96#8:5692\n81#8,6:5704\n88#8,6:5719\n81#8,6:5735\n88#8,6:5750\n96#8:5759\n81#8,6:5770\n88#8,6:5785\n81#8,6:5803\n88#8,6:5818\n96#8:5836\n96#8:5840\n81#8,6:5851\n88#8,6:5866\n96#8:5875\n81#8,6:5897\n88#8,6:5912\n81#8,6:5931\n88#8,6:5946\n96#8:5970\n96#8:5982\n96#8:5986\n96#8:6000\n81#8,6:6012\n88#8,6:6027\n81#8,6:6047\n88#8,6:6062\n96#8:6081\n81#8,6:6090\n88#8,6:6105\n96#8:6116\n81#8,6:6129\n88#8,6:6144\n81#8,6:6160\n88#8,6:6175\n96#8:6184\n96#8:6196\n81#8,6:6205\n88#8,6:6220\n96#8:6252\n81#8,6:6262\n88#8,6:6277\n81#8,6:6295\n88#8,6:6310\n81#8,6:6336\n88#8,6:6351\n81#8,6:6369\n88#8,6:6384\n96#8:6395\n96#8:6399\n96#8:6411\n81#8,6:6423\n88#8,6:6438\n96#8:6461\n96#8:6492\n81#8,6:6502\n88#8,6:6517\n81#8,6:6546\n88#8,6:6561\n96#8:6571\n96#8:6594\n81#8,6:6603\n88#8,6:6618\n81#8,6:6636\n88#8,6:6651\n96#8:6661\n96#8:6665\n81#8,6:6678\n88#8,6:6693\n96#8:6716\n96#8:6720\n81#8,6:6732\n88#8,6:6747\n81#8,6:6761\n88#8,6:6776\n81#8,6:6795\n88#8,6:6810\n96#8:6839\n96#8:6843\n81#8,6:6852\n88#8,6:6867\n96#8:6878\n81#8,6:6891\n88#8,6:6906\n81#8,6:6922\n88#8,6:6937\n96#8:6946\n96#8:6958\n81#8,6:6967\n88#8,6:6982\n81#8,6:7045\n88#8,6:7060\n96#8:7077\n96#8:7081\n81#8,6:7090\n88#8,6:7105\n81#8,6:7123\n88#8,6:7138\n96#8:7148\n81#8,6:7162\n88#8,6:7177\n96#8:7214\n96#8:7218\n81#8,6:7231\n88#8,6:7246\n81#8,6:7263\n88#8,6:7278\n96#8:7308\n96#8:7319\n96#8:7323\n96#8:7327\n96#8:7421\n96#8:7425\n81#8,6:7458\n88#8,6:7473\n96#8:7482\n81#8,6:7517\n88#8,6:7532\n96#8:7541\n81#8,6:7549\n88#8,6:7564\n96#8:7575\n81#8,6:7620\n88#8,6:7635\n96#8:7644\n81#8,6:7657\n88#8,6:7672\n96#8:7683\n81#8,6:7697\n88#8,6:7712\n81#8,6:7730\n88#8,6:7745\n96#8:7754\n96#8:7758\n81#8,6:7791\n88#8,6:7806\n96#8:7817\n81#8,6:7830\n88#8,6:7845\n96#8:7856\n81#8,6:7880\n88#8,6:7895\n81#8,6:7913\n88#8,6:7928\n81#8,6:7945\n88#8,6:7960\n96#8:7970\n81#8,6:7984\n88#8,6:7999\n96#8:8008\n96#8:8012\n96#8:8024\n81#8,6:8063\n88#8,6:8078\n96#8:8087\n81#8,6:8152\n88#8,6:8167\n81#8,6:8196\n88#8,6:8211\n81#8,6:8237\n88#8,6:8252\n96#8:8261\n96#8:8266\n81#8,6:8279\n88#8,6:8294\n96#8:8315\n96#8:8319\n81#8,6:8329\n88#8,6:8344\n81#8,6:8361\n88#8,6:8376\n81#8,6:8402\n88#8,6:8417\n96#8:8426\n96#8:8431\n81#8,6:8468\n88#8,6:8483\n96#8:8504\n96#8:8508\n81#8,6:8531\n88#8,6:8546\n81#8,6:8595\n88#8,6:8610\n96#8:8631\n96#8:8635\n81#8,6:8648\n88#8,6:8663\n96#8:8672\n81#8,6:8700\n88#8,6:8715\n81#8,6:8750\n88#8,6:8765\n96#8:8788\n81#8,6:8813\n88#8,6:8828\n96#8:8849\n96#8:8853\n81#8,6:8866\n88#8,6:8881\n81#8,6:8911\n88#8,6:8926\n96#8:8947\n96#8:8951\n81#8,6:8961\n88#8,6:8976\n81#8,6:9019\n88#8,6:9034\n96#8:9043\n81#8,6:9055\n88#8,6:9070\n96#8:9091\n96#8:9095\n81#8,6:9146\n88#8,6:9161\n81#8,6:9185\n88#8,6:9200\n96#8:9209\n81#8,6:9221\n88#8,6:9236\n96#8:9245\n81#8,6:9257\n88#8,6:9272\n96#8:9281\n81#8,6:9301\n88#8,6:9316\n96#8:9325\n96#8:9343\n81#8,6:9353\n88#8,6:9368\n81#8,6:9385\n88#8,6:9400\n81#8,6:9426\n88#8,6:9441\n96#8:9450\n96#8:9455\n81#8,6:9467\n88#8,6:9482\n81#8,6:9508\n88#8,6:9523\n96#8:9532\n96#8:9537\n81#8,6:9550\n88#8,6:9565\n96#8:9586\n96#8:9590\n81#8,6:9603\n88#8,6:9618\n96#8:9627\n81#8,6:9646\n88#8,6:9661\n96#8:9670\n81#8,6:9683\n88#8,6:9698\n96#8:9707\n81#8,6:9723\n88#8,6:9738\n96#8:9747\n81#8,6:9759\n88#8,6:9774\n81#8,6:9792\n88#8,6:9807\n81#8,6:9824\n88#8,6:9839\n96#8:9850\n81#8,6:9859\n88#8,6:9874\n96#8:9898\n81#8,6:9912\n88#8,6:9927\n96#8:9951\n96#8:9955\n96#8:9959\n81#8,6:10000\n88#8,6:10015\n81#8,6:10029\n88#8,6:10044\n96#8:10061\n81#8,6:10070\n88#8,6:10085\n81#8,6:10108\n88#8,6:10123\n96#8:10140\n96#8:10144\n81#8,6:10157\n88#8,6:10172\n96#8:10184\n81#8,6:10196\n88#8,6:10211\n96#8:10220\n81#8,6:10236\n88#8,6:10251\n81#8,6:10270\n88#8,6:10285\n96#8:10308\n96#8:10320\n96#8:10324\n81#8,6:10374\n88#8,6:10389\n81#8,6:10419\n88#8,6:10434\n81#8,6:10453\n88#8,6:10468\n81#8,6:10493\n88#8,6:10508\n96#8:10517\n96#8:10522\n96#8:10527\n81#8,6:10545\n88#8,6:10560\n96#8:10576\n81#8,6:10602\n88#8,6:10617\n96#8:10626\n81#8,6:10639\n88#8,6:10654\n96#8:10675\n96#8:10679\n81#8,6:10859\n88#8,6:10874\n81#8,6:10892\n88#8,6:10907\n96#8:10917\n81#8,6:10930\n88#8,6:10945\n96#8:10955\n96#8:10959\n81#8,6:10978\n88#8,6:10993\n81#8,6:11009\n88#8,6:11024\n81#8,6:11037\n88#8,6:11052\n81#8,6:11071\n88#8,6:11086\n96#8:11104\n96#8:11108\n81#8,6:11121\n88#8,6:11136\n96#8:11145\n96#8:11149\n96#8:11153\n81#8,6:11166\n88#8,6:11181\n96#8:11190\n81#8,6:11204\n88#8,6:11219\n81#8,6:11251\n88#8,6:11266\n81#8,6:11283\n88#8,6:11298\n96#8:11307\n96#8:11312\n96#8:11322\n81#8,6:11334\n88#8,6:11349\n81#8,6:11362\n88#8,6:11377\n81#8,6:11396\n88#8,6:11411\n96#8:11421\n96#8:11425\n81#8,6:11435\n88#8,6:11450\n81#8,6:11469\n88#8,6:11484\n81#8,6:11506\n88#8,6:11521\n96#8:11531\n81#8,6:11548\n88#8,6:11563\n96#8:11572\n96#8:11576\n96#8:11582\n96#8:11586\n81#8,6:11614\n88#8,6:11629\n81#8,6:11642\n88#8,6:11657\n81#8,6:11675\n88#8,6:11690\n96#8:11699\n96#8:11703\n81#8,6:11716\n88#8,6:11731\n81#8,6:11752\n88#8,6:11767\n81#8,6:11798\n88#8,6:11813\n81#8,6:11831\n88#8,6:11846\n96#8:11855\n96#8:11859\n96#8:11864\n96#8:11880\n96#8:11893\n81#8,6:11913\n88#8,6:11928\n96#8:11937\n391#9,9:4893\n400#9:4908\n391#9,9:4925\n400#9:4940\n391#9,9:4954\n400#9:4969\n391#9,9:4987\n400#9:5002\n391#9,9:5028\n400#9,3:5043\n401#9,2:5048\n391#9,9:5069\n400#9:5084\n401#9,2:5103\n401#9,2:5107\n391#9,9:5124\n400#9:5139\n391#9,9:5159\n400#9:5174\n391#9,9:5191\n400#9:5206\n401#9,2:5219\n391#9,9:5239\n400#9:5254\n401#9,2:5267\n401#9,2:5271\n401#9,2:5275\n391#9,9:5294\n400#9,3:5309\n391#9,9:5359\n400#9:5374\n401#9,2:5392\n391#9,9:5412\n400#9:5427\n391#9,9:5444\n400#9:5459\n391#9,9:5473\n400#9:5488\n391#9,9:5518\n400#9:5533\n391#9,9:5575\n400#9:5590\n401#9,2:5593\n401#9,2:5597\n401#9,2:5601\n391#9,9:5628\n400#9:5643\n391#9,9:5669\n400#9,3:5684\n401#9,2:5690\n391#9,9:5710\n400#9:5725\n391#9,9:5741\n400#9,3:5756\n391#9,9:5776\n400#9:5791\n391#9,9:5809\n400#9:5824\n401#9,2:5834\n401#9,2:5838\n391#9,9:5857\n400#9,3:5872\n391#9,9:5903\n400#9:5918\n391#9,9:5937\n400#9:5952\n401#9,2:5968\n401#9,2:5980\n401#9,2:5984\n401#9,2:5998\n391#9,9:6018\n400#9:6033\n391#9,9:6053\n400#9:6068\n401#9,2:6079\n391#9,9:6096\n400#9:6111\n401#9,2:6114\n391#9,9:6135\n400#9:6150\n391#9,9:6166\n400#9,3:6181\n401#9,2:6194\n391#9,9:6211\n400#9:6226\n401#9,2:6250\n391#9,9:6268\n400#9:6283\n391#9,9:6301\n400#9:6316\n391#9,9:6342\n400#9:6357\n391#9,9:6375\n400#9:6390\n401#9,2:6393\n401#9,2:6397\n401#9,2:6409\n391#9,9:6429\n400#9:6444\n401#9,2:6459\n401#9,2:6490\n391#9,9:6508\n400#9:6523\n391#9,9:6552\n400#9:6567\n401#9,2:6569\n401#9,2:6592\n391#9,9:6609\n400#9:6624\n391#9,9:6642\n400#9:6657\n401#9,2:6659\n401#9,2:6663\n391#9,9:6684\n400#9:6699\n401#9,2:6714\n401#9,2:6718\n391#9,9:6738\n400#9:6753\n391#9,9:6767\n400#9:6782\n391#9,9:6801\n400#9:6816\n401#9,2:6837\n401#9,2:6841\n391#9,9:6858\n400#9:6873\n401#9,2:6876\n391#9,9:6897\n400#9:6912\n391#9,9:6928\n400#9,3:6943\n401#9,2:6956\n391#9,9:6973\n400#9:6988\n391#9,9:7051\n400#9:7066\n401#9,2:7075\n401#9,2:7079\n391#9,9:7096\n400#9:7111\n391#9,9:7129\n400#9:7144\n401#9,2:7146\n391#9,9:7168\n400#9:7183\n401#9,2:7212\n401#9,2:7216\n391#9,9:7237\n400#9:7252\n391#9,9:7269\n400#9:7284\n401#9,2:7306\n401#9,2:7317\n401#9,2:7321\n401#9,2:7325\n401#9,2:7419\n401#9,2:7423\n391#9,9:7464\n400#9,3:7479\n391#9,9:7523\n400#9,3:7538\n391#9,9:7555\n400#9:7570\n401#9,2:7573\n391#9,9:7626\n400#9,3:7641\n391#9,9:7663\n400#9:7678\n401#9,2:7681\n391#9,9:7703\n400#9:7718\n391#9,9:7736\n400#9,3:7751\n401#9,2:7756\n391#9,9:7797\n400#9:7812\n401#9,2:7815\n391#9,9:7836\n400#9:7851\n401#9,2:7854\n391#9,9:7886\n400#9:7901\n391#9,9:7919\n400#9:7934\n391#9,9:7951\n400#9:7966\n401#9,2:7968\n391#9,9:7990\n400#9,3:8005\n401#9,2:8010\n401#9,2:8022\n391#9,9:8069\n400#9,3:8084\n391#9,9:8158\n400#9:8173\n391#9,9:8202\n400#9:8217\n391#9,9:8243\n400#9,3:8258\n401#9,2:8264\n391#9,9:8285\n400#9:8300\n401#9,2:8313\n401#9,2:8317\n391#9,9:8335\n400#9:8350\n391#9,9:8367\n400#9:8382\n391#9,9:8408\n400#9,3:8423\n401#9,2:8429\n391#9,9:8474\n400#9:8489\n401#9,2:8502\n401#9,2:8506\n391#9,9:8537\n400#9:8552\n391#9,9:8601\n400#9:8616\n401#9,2:8629\n401#9,2:8633\n391#9,9:8654\n400#9,3:8669\n391#9,9:8706\n400#9:8721\n391#9,9:8756\n400#9:8771\n401#9,2:8786\n391#9,9:8819\n400#9:8834\n401#9,2:8847\n401#9,2:8851\n391#9,9:8872\n400#9:8887\n391#9,9:8917\n400#9:8932\n401#9,2:8945\n401#9,2:8949\n391#9,9:8967\n400#9:8982\n391#9,9:9025\n400#9,3:9040\n391#9,9:9061\n400#9:9076\n401#9,2:9089\n401#9,2:9093\n391#9,9:9152\n400#9:9167\n391#9,9:9191\n400#9,3:9206\n391#9,9:9227\n400#9,3:9242\n391#9,9:9263\n400#9,3:9278\n391#9,9:9307\n400#9,3:9322\n401#9,2:9341\n391#9,9:9359\n400#9:9374\n391#9,9:9391\n400#9:9406\n391#9,9:9432\n400#9,3:9447\n401#9,2:9453\n391#9,9:9473\n400#9:9488\n391#9,9:9514\n400#9,3:9529\n401#9,2:9535\n391#9,9:9556\n400#9:9571\n401#9,2:9584\n401#9,2:9588\n391#9,9:9609\n400#9,3:9624\n391#9,9:9652\n400#9,3:9667\n391#9,9:9689\n400#9,3:9704\n391#9,9:9729\n400#9,3:9744\n391#9,9:9765\n400#9:9780\n391#9,9:9798\n400#9:9813\n391#9,9:9830\n400#9:9845\n401#9,2:9848\n391#9,9:9865\n400#9:9880\n401#9,2:9896\n391#9,9:9918\n400#9:9933\n401#9,2:9949\n401#9,2:9953\n401#9,2:9957\n391#9,9:10006\n400#9:10021\n391#9,9:10035\n400#9:10050\n401#9,2:10059\n391#9,9:10076\n400#9:10091\n391#9,9:10114\n400#9:10129\n401#9,2:10138\n401#9,2:10142\n391#9,9:10163\n400#9:10178\n401#9,2:10182\n391#9,9:10202\n400#9,3:10217\n391#9,9:10242\n400#9:10257\n391#9,9:10276\n400#9:10291\n401#9,2:10306\n401#9,2:10318\n401#9,2:10322\n391#9,9:10380\n400#9:10395\n391#9,9:10425\n400#9:10440\n391#9,9:10459\n400#9:10474\n391#9,9:10499\n400#9,3:10514\n401#9,2:10520\n401#9,2:10525\n391#9,9:10551\n400#9:10566\n401#9,2:10574\n391#9,9:10608\n400#9,3:10623\n391#9,9:10645\n400#9:10660\n401#9,2:10673\n401#9,2:10677\n391#9,9:10865\n400#9:10880\n391#9,9:10898\n400#9:10913\n401#9,2:10915\n391#9,9:10936\n400#9:10951\n401#9,2:10953\n401#9,2:10957\n391#9,9:10984\n400#9:10999\n391#9,9:11015\n400#9:11030\n391#9,9:11043\n400#9:11058\n391#9,9:11077\n400#9:11092\n401#9,2:11102\n401#9,2:11106\n391#9,9:11127\n400#9,3:11142\n401#9,2:11147\n401#9,2:11151\n391#9,9:11172\n400#9,3:11187\n391#9,9:11210\n400#9:11225\n391#9,9:11257\n400#9:11272\n391#9,9:11289\n400#9,3:11304\n401#9,2:11310\n401#9,2:11320\n391#9,9:11340\n400#9:11355\n391#9,9:11368\n400#9:11383\n391#9,9:11402\n400#9:11417\n401#9,2:11419\n401#9,2:11423\n391#9,9:11441\n400#9:11456\n391#9,9:11475\n400#9:11490\n391#9,9:11512\n400#9:11527\n401#9,2:11529\n391#9,9:11554\n400#9,3:11569\n401#9,2:11574\n401#9,2:11580\n401#9,2:11584\n391#9,9:11620\n400#9:11635\n391#9,9:11648\n400#9:11663\n391#9,9:11681\n400#9,3:11696\n401#9,2:11701\n391#9,9:11722\n400#9:11737\n391#9,9:11758\n400#9:11773\n391#9,9:11804\n400#9:11819\n391#9,9:11837\n400#9,3:11852\n401#9,2:11857\n401#9,2:11862\n401#9,2:11878\n401#9,2:11891\n391#9,9:11919\n400#9,3:11934\n87#10:4909\n84#10,9:4910\n87#10,6:5112\n87#10:5142\n83#10,10:5143\n94#10:5274\n94#10:5278\n87#10:5343\n84#10,9:5344\n94#10:5395\n87#10:5396\n84#10,9:5397\n87#10:5428\n84#10,9:5429\n87#10:5501\n83#10,10:5502\n94#10:5600\n87#10:5792\n83#10,10:5793\n94#10:5837\n87#10:5920\n83#10,10:5921\n94#10:5971\n94#10:6001\n87#10:6002\n84#10,9:6003\n94#10:6721\n87#10:6722\n84#10,9:6723\n87#10:7222\n85#10,8:7223\n94#10:7320\n94#10:7324\n94#10:7328\n94#10:7422\n87#10:7973\n83#10,10:7974\n94#10:8009\n87#10:8053\n84#10,9:8054\n94#10:8088\n87#10,6:8146\n94#10:8320\n87#10,6:8323\n94#10:8509\n87#10,6:8525\n94#10:8636\n87#10:8638\n84#10,9:8639\n94#10:8673\n87#10,6:8694\n94#10:8854\n87#10,6:8860\n94#10:8952\n87#10,6:8955\n87#10:9009\n84#10,9:9010\n94#10:9044\n94#10:9096\n87#10,6:9140\n94#10:9344\n87#10,6:9347\n94#10:9591\n87#10:9749\n84#10,9:9750\n87#10:9814\n84#10,9:9815\n94#10:9851\n87#10:9902\n84#10,9:9903\n94#10:9952\n94#10:9960\n87#10:9989\n83#10,10:9990\n94#10:10325\n87#10,6:10368\n87#10:10410\n85#10,8:10411\n94#10:10528\n87#10:10536\n85#10,8:10537\n94#10:10577\n87#10:10593\n85#10,8:10594\n94#10:10627\n94#10:10680\n87#10:10850\n85#10,8:10851\n87#10:10919\n83#10,10:10920\n94#10:10956\n94#10:10960\n87#10:11000\n85#10,8:11001\n87#10:11110\n83#10,10:11111\n94#10:11146\n94#10:11150\n87#10:11273\n84#10,9:11274\n94#10:11308\n87#10:11324\n84#10,9:11325\n94#10:11587\n87#10:11604\n84#10,9:11605\n87#10:11664\n83#10,10:11665\n94#10:11700\n87#10:11706\n84#10,9:11707\n87#10:11820\n83#10,10:11821\n94#10:11856\n94#10:11881\n94#10:11894\n122#11:4941\n122#11:5009\n122#11:5010\n122#11:5111\n122#11:5140\n122#11:5141\n122#11:5175\n122#11:5223\n122#11:5375\n122#11:5376\n122#11:5383\n122#11:5384\n122#11:5385\n122#11:5460\n122#11:5489\n122#11:5490\n122#11:5491\n122#11:5492\n122#11:5499\n122#11:5500\n122#11:5546\n122#11:5547\n122#11:5591\n122#11:5592\n122#11:5614\n122#11:5615\n122#11:5645\n122#11:5646\n122#11:5653\n122#11:5825\n122#11:5826\n122#11:5827\n122#11:5877\n122#11:5878\n122#11:5879\n122#11:5886\n122#11:5919\n122#11:5953\n122#11:5954\n122#11:5961\n122#11:5978\n122#11:5979\n122#11:5988\n122#11:5995\n122#11:5996\n122#11:5997\n122#11:6040\n122#11:6069\n122#11:6070\n122#11:6071\n122#11:6072\n122#11:6083\n122#11:6112\n122#11:6113\n122#11:6118\n122#11:6186\n122#11:6187\n122#11:6198\n122#11:6233\n122#11:6234\n122#11:6241\n122#11:6242\n122#11:6249\n122#11:6254\n122#11:6255\n122#11:6317\n122#11:6318\n122#11:6319\n122#11:6326\n122#11:6391\n122#11:6392\n122#11:6407\n122#11:6408\n122#11:6451\n122#11:6452\n122#11:6475\n122#11:6482\n122#11:6489\n122#11:6494\n122#11:6495\n122#11:6530\n122#11:6568\n122#11:6591\n122#11:6596\n122#11:6658\n122#11:6667\n122#11:6668\n122#11:6700\n122#11:6707\n122#11:6754\n122#11:6783\n122#11:6817\n122#11:6818\n122#11:6819\n122#11:6820\n122#11:6827\n122#11:6828\n122#11:6829\n122#11:6830\n122#11:6845\n122#11:6874\n122#11:6875\n122#11:6880\n122#11:6948\n122#11:6949\n122#11:6960\n122#11:6995\n122#11:6996\n122#11:7003\n122#11:7004\n122#11:7011\n122#11:7012\n122#11:7019\n122#11:7020\n122#11:7027\n122#11:7028\n122#11:7073\n122#11:7074\n122#11:7083\n122#11:7145\n122#11:7150\n122#11:7190\n122#11:7197\n122#11:7204\n122#11:7211\n122#11:7220\n122#11:7221\n122#11:7253\n122#11:7285\n122#11:7292\n122#11:7299\n122#11:7310\n122#11:7427\n122#11:7428\n122#11:7429\n122#11:7442\n122#11:7443\n122#11:7444\n122#11:7445\n122#11:7446\n122#11:7447\n122#11:7448\n122#11:7449\n122#11:7450\n122#11:7451\n122#11:7507\n122#11:7508\n122#11:7509\n122#11:7510\n122#11:7571\n122#11:7572\n122#11:7577\n122#11:7679\n122#11:7680\n122#11:7719\n122#11:7720\n122#11:7778\n122#11:7779\n122#11:7813\n122#11:7814\n122#11:7852\n122#11:7853\n122#11:7864\n122#11:7873\n122#11:7935\n122#11:7967\n122#11:7972\n122#11:8014\n122#11:8015\n122#11:8039\n122#11:8040\n122#11:8041\n122#11:8043\n122#11:8044\n122#11:8052\n122#11:8098\n122#11:8099\n122#11:8100\n122#11:8101\n122#11:8115\n122#11:8116\n122#11:8117\n122#11:8118\n122#11:8119\n122#11:8120\n122#11:8121\n122#11:8122\n122#11:8144\n122#11:8145\n122#11:8186\n122#11:8219\n122#11:8220\n122#11:8227\n122#11:8268\n122#11:8269\n122#11:8321\n122#11:8322\n122#11:8351\n122#11:8384\n122#11:8385\n122#11:8392\n122#11:8457\n122#11:8458\n122#11:8523\n122#11:8524\n122#11:8576\n122#11:8577\n122#11:8584\n122#11:8585\n122#11:8637\n122#11:8692\n122#11:8693\n122#11:8778\n122#11:8779\n122#11:8802\n122#11:8803\n122#11:8858\n122#11:8859\n122#11:8900\n122#11:8901\n122#11:8953\n122#11:8954\n122#11:9005\n122#11:9006\n122#11:9007\n122#11:9008\n122#11:9045\n122#11:9138\n122#11:9139\n122#11:9174\n122#11:9175\n122#11:9211\n122#11:9247\n122#11:9283\n122#11:9284\n122#11:9291\n122#11:9327\n122#11:9328\n122#11:9345\n122#11:9346\n122#11:9375\n122#11:9408\n122#11:9409\n122#11:9416\n122#11:9457\n122#11:9490\n122#11:9491\n122#11:9498\n122#11:9539\n122#11:9540\n122#11:9781\n122#11:9852\n122#11:9881\n122#11:9888\n122#11:9889\n122#11:9900\n122#11:9901\n122#11:9934\n122#11:9941\n122#11:9942\n122#11:9987\n122#11:9988\n122#11:10022\n122#11:10051\n122#11:10052\n122#11:10063\n122#11:10130\n122#11:10137\n122#11:10146\n122#11:10179\n122#11:10180\n122#11:10181\n122#11:10186\n122#11:10222\n122#11:10229\n122#11:10258\n122#11:10292\n122#11:10299\n122#11:10310\n122#11:10311\n122#11:10366\n122#11:10367\n122#11:10402\n122#11:10409\n122#11:10441\n122#11:10476\n122#11:10483\n122#11:10524\n122#11:10535\n122#11:10573\n122#11:10584\n122#11:10585\n122#11:10592\n122#11:10628\n122#11:10629\n122#11:10681\n122#11:10682\n122#11:10683\n122#11:10684\n122#11:10685\n122#11:10686\n122#11:10687\n122#11:10688\n122#11:10689\n122#11:10690\n122#11:10691\n122#11:10692\n122#11:10693\n122#11:10694\n122#11:10695\n122#11:10696\n122#11:10697\n122#11:10698\n122#11:10699\n122#11:10700\n122#11:10701\n122#11:10702\n122#11:10703\n122#11:10704\n122#11:10708\n122#11:10709\n122#11:10710\n122#11:10711\n122#11:10712\n122#11:10713\n122#11:10849\n122#11:10881\n122#11:10882\n122#11:10914\n122#11:10952\n122#11:10961\n122#11:10962\n122#11:10963\n122#11:10967\n122#11:11059\n122#11:11099\n122#11:11100\n122#11:11101\n122#11:11192\n122#11:11193\n122#11:11238\n122#11:11239\n122#11:11240\n122#11:11241\n122#11:11242\n122#11:11243\n122#11:11244\n122#11:11309\n122#11:11384\n122#11:11418\n122#11:11427\n122#11:11428\n122#11:11457\n122#11:11528\n122#11:11578\n122#11:11579\n122#11:11603\n122#11:11705\n122#11:11739\n122#11:11741\n122#11:11742\n122#11:11778\n122#11:11779\n122#11:11780\n122#11:11787\n122#11:11867\n122#11:11869\n122#11:11870\n122#11:11871\n122#11:11882\n122#11:11889\n122#11:11890\n122#11:11901\n122#11:11902\n122#11:11903\n99#12,6:4942\n99#12:4970\n95#12,10:4971\n99#12:5011\n95#12,10:5012\n106#12:5047\n106#12:5051\n99#12:5052\n95#12,10:5053\n106#12:5106\n106#12:5110\n99#12:5176\n97#12,8:5177\n106#12:5222\n99#12:5224\n97#12,8:5225\n106#12:5270\n99#12,6:5461\n106#12:5604\n99#12,6:5616\n106#12:5693\n99#12,6:6041\n106#12:6082\n99#12,6:6084\n106#12:6117\n99#12,6:6199\n106#12:6253\n99#12,6:6256\n99#12:6358\n95#12,10:6359\n106#12:6396\n106#12:6493\n99#12,6:6496\n106#12:6595\n99#12,6:6597\n99#12:6625\n95#12,10:6626\n106#12:6662\n106#12:6666\n99#12:6669\n97#12,8:6670\n106#12:6717\n99#12,6:6755\n99#12:6784\n95#12,10:6785\n106#12:6840\n106#12:6844\n99#12,6:6846\n106#12:6879\n99#12,6:6961\n99#12:7035\n96#12,9:7036\n106#12:7078\n106#12:7082\n99#12,6:7084\n99#12:7112\n95#12,10:7113\n106#12:7149\n99#12:7151\n95#12,10:7152\n106#12:7215\n106#12:7219\n99#12:7254\n97#12,8:7255\n106#12:7309\n99#12,6:7452\n106#12:7483\n99#12,6:7511\n106#12:7542\n99#12,6:7543\n106#12:7576\n99#12:7646\n95#12,10:7647\n106#12:7684\n99#12:7687\n96#12,9:7688\n106#12:7759\n99#12:7780\n95#12,10:7781\n106#12:7818\n99#12:7819\n95#12,10:7820\n106#12:7857\n99#12,6:7874\n99#12:7902\n95#12,10:7903\n106#12:8013\n106#12:8025\n99#12:8187\n97#12,8:8188\n106#12:8267\n99#12:8270\n97#12,8:8271\n106#12:8316\n99#12:8352\n97#12,8:8353\n106#12:8432\n99#12:8459\n97#12,8:8460\n106#12:8505\n99#12:8586\n97#12,8:8587\n106#12:8632\n99#12:8804\n97#12,8:8805\n106#12:8850\n99#12:8902\n97#12,8:8903\n106#12:8948\n99#12:9046\n97#12,8:9047\n106#12:9092\n99#12:9376\n97#12,8:9377\n106#12:9456\n99#12:9458\n97#12,8:9459\n106#12:9538\n99#12:9541\n97#12,8:9542\n106#12:9587\n99#12:9782\n96#12,9:9783\n99#12,6:9853\n106#12:9899\n106#12:9956\n99#12,6:10023\n106#12:10062\n99#12,6:10064\n99#12:10098\n96#12,9:10099\n106#12:10141\n106#12:10145\n99#12:10147\n96#12,9:10148\n106#12:10185\n99#12,6:10230\n99#12:10259\n95#12,10:10260\n106#12:10309\n106#12:10321\n99#12:10442\n95#12,10:10443\n106#12:10523\n99#12:10630\n97#12,8:10631\n106#12:10676\n99#12,6:11031\n99#12:11060\n95#12,10:11061\n106#12:11105\n106#12:11109\n99#12,6:11245\n106#12:11313\n99#12,6:11356\n99#12:11385\n95#12,10:11386\n106#12:11422\n106#12:11426\n99#12,6:11429\n99#12:11458\n95#12,10:11459\n106#12:11577\n106#12:11583\n99#12,6:11636\n106#12:11704\n99#12:11743\n97#12,8:11744\n106#12:11865\n168#13,13:7578\n168#13,13:8026\n168#13,13:8102\n168#13,13:8510\n168#13,13:9097\n168#13,13:9110\n168#13,13:10326\n524#14,18:7591\n524#14,18:7760\n85#15:7685\n85#15:7686\n85#15:8089\n85#15:8141\n117#15,2:8142\n85#15:8674\n85#15:8683\n117#15,2:8684\n85#15:8686\n117#15,2:8687\n85#15:8689\n117#15,2:8690\n85#15:8855\n117#15,2:8856\n85#15:9123\n117#15,2:9124\n85#15:10339\n117#15,2:10340\n85#15:10360\n117#15,2:10361\n85#15:10363\n117#15,2:10364\n85#15:10705\n117#15,2:10706\n85#15:10714\n85#15:10715\n85#15:10716\n85#15:10717\n85#15:10718\n85#15:10719\n85#15:10720\n85#15:10721\n85#15:10722\n85#15:10723\n85#15:10724\n85#15:10725\n85#15:10726\n85#15:10727\n85#15:10728\n85#15:10729\n85#15:10730\n85#15:10731\n85#15:10732\n85#15:10733\n85#15:10734\n85#15:10735\n85#15:10736\n85#15:10737\n85#15:10738\n117#15,2:10739\n85#15:10741\n117#15,2:10742\n85#15:10744\n117#15,2:10745\n85#15:10747\n117#15,2:10748\n85#15:10750\n117#15,2:10751\n85#15:10753\n117#15,2:10754\n85#15:10756\n117#15,2:10757\n85#15:10759\n117#15,2:10760\n85#15:10762\n117#15,2:10763\n85#15:10765\n117#15,2:10766\n85#15:10768\n117#15,2:10769\n85#15:10771\n117#15,2:10772\n85#15:10774\n117#15,2:10775\n85#15:10777\n117#15,2:10778\n85#15:10780\n117#15,2:10781\n85#15:10783\n117#15,2:10784\n85#15:10786\n117#15,2:10787\n85#15:10789\n117#15,2:10790\n85#15:10792\n117#15,2:10793\n85#15:10795\n117#15,2:10796\n85#15:10798\n117#15,2:10799\n85#15:10801\n117#15,2:10802\n85#15:10804\n117#15,2:10805\n85#15:10807\n117#15,2:10808\n85#15:10810\n117#15,2:10811\n85#15:10813\n117#15,2:10814\n85#15:10816\n117#15,2:10817\n85#15:10819\n117#15,2:10820\n85#15:10822\n117#15,2:10823\n85#15:10825\n117#15,2:10826\n85#15:10828\n117#15,2:10829\n85#15:10831\n117#15,2:10832\n85#15:10834\n117#15,2:10835\n85#15:10837\n117#15,2:10838\n85#15:10840\n117#15,2:10841\n85#15:10964\n117#15,2:10965\n85#15:11895\n117#15,2:11896\n85#15:11898\n117#15,2:11899\n567#16:9973\n552#16,6:9974\n490#17,11:11227\n*S KotlinDebug\n*F\n+ 1 BillingScreen.kt\ncom/example/sasloopmanager/BillingScreenKt\n*L\n87#1:4607,6\n96#1:4613,3\n96#1:4619,3\n105#1:4622,3\n105#1:4626,3\n110#1:4629,6\n115#1:4635,6\n118#1:4641,6\n121#1:4647,6\n139#1:4653,6\n140#1:4659,6\n141#1:4665,6\n150#1:4671,6\n151#1:4677,6\n152#1:4683,6\n153#1:4689,6\n154#1:4695,6\n157#1:4701,6\n160#1:4708,6\n161#1:4714,6\n162#1:4720,6\n163#1:4726,6\n164#1:4732,6\n166#1:4738,6\n167#1:4744,6\n168#1:4750,6\n169#1:4756,6\n170#1:4762,6\n171#1:4768,6\n172#1:4774,6\n173#1:4780,6\n174#1:4786,6\n175#1:4792,6\n176#1:4798,6\n177#1:4804,6\n178#1:4810,6\n179#1:4816,6\n180#1:4822,6\n183#1:4828,3\n183#1:4833,3\n191#1:4836,6\n192#1:4842,6\n205#1:4848,6\n210#1:4854,6\n274#1:4863,3\n274#1:4868,3\n285#1:4871,6\n318#1:5003,6\n358#1:5085,6\n362#1:5091,6\n366#1:5097,6\n407#1:5207,6\n417#1:5213,6\n432#1:5255,6\n442#1:5261,6\n457#1:5314,3\n457#1:5331,3\n461#1:5334,3\n461#1:5340,3\n474#1:5377,6\n505#1:5386,6\n688#1:5493,6\n742#1:5534,6\n744#1:5540,6\n768#1:5548,6\n770#1:5554,6\n788#1:5605,3\n788#1:5611,3\n812#1:5647,6\n842#1:5828,6\n858#1:5880,6\n911#1:5955,6\n924#1:5962,6\n941#1:5972,6\n1017#1:5989,6\n1073#1:6034,6\n1100#1:6073,6\n1151#1:6188,6\n1262#1:6227,6\n1281#1:6235,6\n1294#1:6243,6\n1314#1:6320,6\n1327#1:6401,6\n1361#1:6445,6\n1373#1:6453,6\n1425#1:6463,6\n1432#1:6469,6\n1446#1:6476,6\n1458#1:6483,6\n1474#1:6524,6\n1485#1:6531,6\n1508#1:6573,6\n1516#1:6579,6\n1524#1:6585,6\n1564#1:6701,6\n1592#1:6708,6\n1650#1:6821,6\n1662#1:6831,6\n1722#1:6950,6\n1776#1:6989,6\n1795#1:6997,6\n1809#1:7005,6\n1821#1:7013,6\n1833#1:7021,6\n1846#1:7029,6\n1850#1:7067,6\n1914#1:7184,6\n1925#1:7191,6\n1958#1:7198,6\n1969#1:7205,6\n1996#1:7286,6\n2033#1:7293,6\n2069#1:7300,6\n2080#1:7311,6\n2128#1:7329,6\n2217#1:7335,6\n2351#1:7341,6\n2439#1:7347,6\n2595#1:7353,6\n2659#1:7359,6\n2868#1:7365,6\n3065#1:7371,6\n3224#1:7377,6\n3225#1:7383,6\n3242#1:7389,6\n3243#1:7395,6\n3244#1:7401,6\n3247#1:7407,6\n3465#1:7413,6\n3725#1:7430,6\n3727#1:7436,6\n4282#1:7484,6\n4283#1:7490,6\n4286#1:7497,3\n4286#1:7503,3\n965#1:7858,6\n995#1:7866,6\n1052#1:8016,6\n1344#1:8045,6\n1404#1:8091,6\n615#1:8123,6\n627#1:8129,6\n659#1:8135,6\n2147#1:8174,6\n2151#1:8180,6\n2178#1:8221,6\n2194#1:8301,6\n2201#1:8307,6\n2249#1:8386,6\n2266#1:8433,6\n2282#1:8439,6\n2299#1:8445,6\n2312#1:8451,6\n2331#1:8490,6\n2338#1:8496,6\n2370#1:8553,3\n2370#1:8573,3\n2387#1:8578,6\n2416#1:8617,6\n2426#1:8623,6\n2518#1:8676,6\n2461#1:8722,6\n2462#1:8728,6\n2463#1:8734,6\n2468#1:8772,6\n2487#1:8780,6\n2538#1:8790,6\n2552#1:8796,6\n2569#1:8835,6\n2576#1:8841,6\n2614#1:8888,6\n2618#1:8894,6\n2636#1:8933,6\n2643#1:8939,6\n2724#1:8983,6\n2729#1:8989,6\n2757#1:8995,3\n2757#1:9001,3\n2823#1:9077,6\n2830#1:9083,6\n2897#1:9126,6\n2902#1:9132,6\n2887#1:9168,6\n2937#1:9285,6\n2997#1:9329,6\n3053#1:9335,6\n3139#1:9410,6\n3160#1:9492,6\n3174#1:9572,6\n3181#1:9578,6\n3362#1:9882,6\n3366#1:9890,6\n3376#1:9935,6\n3383#1:9943,6\n3275#1:10053,6\n3296#1:10092,6\n3304#1:10131,6\n3337#1:10223,6\n3410#1:10293,6\n3417#1:10300,6\n3430#1:10312,6\n3494#1:10342,6\n3499#1:10348,6\n3504#1:10354,6\n3484#1:10396,6\n3511#1:10403,6\n3520#1:10477,6\n3538#1:10529,6\n3547#1:10567,6\n3558#1:10578,6\n3564#1:10586,6\n3633#1:10661,6\n3640#1:10667,6\n290#1:10843,6\n3800#1:11093,6\n4085#1:11314,6\n4193#1:11491,6\n4213#1:11533,6\n4366#1:11781,6\n4417#1:11872,6\n4439#1:11883,6\n98#1:4616,3\n258#1:4860\n258#1:4861,2\n276#1:4866\n277#1:4867\n458#1:5317,10\n458#1:5327\n458#1:5329\n458#1:5330\n462#1:5337\n462#1:5338,2\n789#1:5608,3\n804#1:5644\n804#1:5689\n4287#1:7500\n4287#1:7501,2\n4502#1:7506\n975#1:7865\n975#1:7872\n1333#1:8042\n1333#1:8051\n1380#1:8090\n1380#1:8097\n2170#1:8218\n2170#1:8263\n2241#1:8383\n2241#1:8428\n2371#1:8556\n2371#1:8557,2\n2376#1:8559,10\n2376#1:8569\n2376#1:8571\n2376#1:8572\n2494#1:8675\n2494#1:8682\n2763#1:8998,3\n3131#1:9407\n3131#1:9452\n3152#1:9489\n3152#1:9534\n3299#1:9629,3\n3306#1:9632,3\n3376#1:9709,3\n3355#1:9846,2\n3411#1:9961\n3411#1:9962\n3411#1:9963,2\n3411#1:9965,2\n3411#1:9967\n3411#1:9968\n3411#1:9969\n3411#1:9970,3\n3421#1:9980,3\n3423#1:9983\n3423#1:9984,3\n3515#1:10475\n3515#1:10519\n4367#1:11588\n4367#1:11589,2\n4368#1:11591,3\n4371#1:11594\n4371#1:11595,2\n4374#1:11597\n4374#1:11598,2\n4441#1:11600\n4441#1:11601,2\n4337#1:11738\n4347#1:11740\n4352#1:11774\n4353#1:11775,3\n4352#1:11861\n4347#1:11866\n4337#1:11868\n458#1:5328\n2376#1:8570\n159#1:4707\n4284#1:7496\n2794#1:9004\n3938#1:11226\n185#1:4831,2\n300#1:4877\n300#1:4878,9\n452#1:5279\n452#1:5280,8\n452#1:5313\n762#1:5560\n762#1:5561,8\n762#1:5596\n806#1:5654\n806#1:5655,8\n806#1:5688\n829#1:5694\n829#1:5695,9\n831#1:5726\n831#1:5727,8\n831#1:5760\n835#1:5761\n835#1:5762,8\n835#1:5841\n848#1:5842\n848#1:5843,8\n848#1:5876\n896#1:5887\n896#1:5888,9\n896#1:5983\n829#1:5987\n1128#1:6119\n1128#1:6120,9\n1135#1:6151\n1135#1:6152,8\n1135#1:6185\n1128#1:6197\n1308#1:6284\n1308#1:6285,10\n1309#1:6327\n1309#1:6328,8\n1309#1:6400\n1308#1:6412\n1358#1:6413\n1358#1:6414,9\n1358#1:6462\n1480#1:6537\n1480#1:6538,8\n1480#1:6572\n1699#1:6881\n1699#1:6882,9\n1706#1:6913\n1706#1:6914,8\n1706#1:6947\n1699#1:6959\n300#1:7426\n644#1:7609\n644#1:7610,10\n644#1:7645\n710#1:7721\n710#1:7722,8\n710#1:7755\n1031#1:7936\n1031#1:7937,8\n1031#1:7971\n2172#1:8228\n2172#1:8229,8\n2172#1:8262\n2243#1:8393\n2243#1:8394,8\n2243#1:8427\n2465#1:8740\n2465#1:8741,9\n2465#1:8789\n2908#1:9176\n2908#1:9177,8\n2908#1:9210\n2917#1:9212\n2917#1:9213,8\n2917#1:9246\n2927#1:9248\n2927#1:9249,8\n2927#1:9282\n2987#1:9292\n2987#1:9293,8\n2987#1:9326\n3133#1:9417\n3133#1:9418,8\n3133#1:9451\n3154#1:9499\n3154#1:9500,8\n3154#1:9533\n3282#1:9592\n3282#1:9593,10\n3282#1:9628\n3363#1:9635\n3363#1:9636,10\n3363#1:9671\n3367#1:9672\n3367#1:9673,10\n3367#1:9708\n3389#1:9712\n3389#1:9713,10\n3389#1:9748\n3333#1:10187\n3333#1:10188,8\n3333#1:10221\n3516#1:10484\n3516#1:10485,8\n3516#1:10518\n3686#1:10883\n3686#1:10884,8\n3686#1:10918\n3774#1:10968\n3774#1:10969,9\n3774#1:11154\n4006#1:11155\n4006#1:11156,10\n4006#1:11191\n3930#1:11194\n3930#1:11195,9\n3930#1:11323\n4186#1:11497\n4186#1:11498,8\n4186#1:11532\n4208#1:11539\n4208#1:11540,8\n4208#1:11573\n4356#1:11788\n4356#1:11789,9\n4356#1:11860\n4544#1:11904\n4544#1:11905,8\n4544#1:11938\n300#1:4887,6\n300#1:4902,6\n305#1:4919,6\n305#1:4934,6\n307#1:4948,6\n307#1:4963,6\n315#1:4981,6\n315#1:4996,6\n325#1:5022,6\n325#1:5037,6\n325#1:5046\n315#1:5050\n356#1:5063,6\n356#1:5078,6\n356#1:5105\n307#1:5109\n379#1:5118,6\n379#1:5133,6\n395#1:5153,6\n395#1:5168,6\n396#1:5185,6\n396#1:5200,6\n396#1:5221\n421#1:5233,6\n421#1:5248,6\n421#1:5269\n395#1:5273\n379#1:5277\n452#1:5288,6\n452#1:5303,6\n452#1:5312\n465#1:5353,6\n465#1:5368,6\n465#1:5394\n600#1:5406,6\n600#1:5421,6\n676#1:5438,6\n676#1:5453,6\n678#1:5467,6\n678#1:5482,6\n729#1:5512,6\n729#1:5527,6\n762#1:5569,6\n762#1:5584,6\n762#1:5595\n729#1:5599\n678#1:5603\n792#1:5622,6\n792#1:5637,6\n806#1:5663,6\n806#1:5678,6\n806#1:5687\n792#1:5692\n829#1:5704,6\n829#1:5719,6\n831#1:5735,6\n831#1:5750,6\n831#1:5759\n835#1:5770,6\n835#1:5785,6\n836#1:5803,6\n836#1:5818,6\n836#1:5836\n835#1:5840\n848#1:5851,6\n848#1:5866,6\n848#1:5875\n896#1:5897,6\n896#1:5912,6\n902#1:5931,6\n902#1:5946,6\n902#1:5970\n896#1:5982\n829#1:5986\n676#1:6000\n1067#1:6012,6\n1067#1:6027,6\n1076#1:6047,6\n1076#1:6062,6\n1076#1:6081\n1114#1:6090,6\n1114#1:6105,6\n1114#1:6116\n1128#1:6129,6\n1128#1:6144,6\n1135#1:6160,6\n1135#1:6175,6\n1135#1:6184\n1128#1:6196\n1256#1:6205,6\n1256#1:6220,6\n1256#1:6252\n1302#1:6262,6\n1302#1:6277,6\n1308#1:6295,6\n1308#1:6310,6\n1309#1:6336,6\n1309#1:6351,6\n1318#1:6369,6\n1318#1:6384,6\n1318#1:6395\n1309#1:6399\n1308#1:6411\n1358#1:6423,6\n1358#1:6438,6\n1358#1:6461\n1302#1:6492\n1466#1:6502,6\n1466#1:6517,6\n1480#1:6546,6\n1480#1:6561,6\n1480#1:6571\n1466#1:6594\n1543#1:6603,6\n1543#1:6618,6\n1551#1:6636,6\n1551#1:6651,6\n1551#1:6661\n1543#1:6665\n1558#1:6678,6\n1558#1:6693,6\n1558#1:6716\n1067#1:6720\n1624#1:6732,6\n1624#1:6747,6\n1630#1:6761,6\n1630#1:6776,6\n1645#1:6795,6\n1645#1:6810,6\n1645#1:6839\n1630#1:6843\n1685#1:6852,6\n1685#1:6867,6\n1685#1:6878\n1699#1:6891,6\n1699#1:6906,6\n1706#1:6922,6\n1706#1:6937,6\n1706#1:6946\n1699#1:6958\n1767#1:6967,6\n1767#1:6982,6\n1844#1:7045,6\n1844#1:7060,6\n1844#1:7077\n1767#1:7081\n1896#1:7090,6\n1896#1:7105,6\n1904#1:7123,6\n1904#1:7138,6\n1904#1:7148\n1909#1:7162,6\n1909#1:7177,6\n1909#1:7214\n1896#1:7218\n1983#1:7231,6\n1983#1:7246,6\n1990#1:7263,6\n1990#1:7278,6\n1990#1:7308\n1983#1:7319\n1624#1:7323\n600#1:7327\n305#1:7421\n300#1:7425\n4254#1:7458,6\n4254#1:7473,6\n4254#1:7482\n4566#1:7517,6\n4566#1:7532,6\n4566#1:7541\n4583#1:7549,6\n4583#1:7564,6\n4583#1:7575\n644#1:7620,6\n644#1:7635,6\n644#1:7644\n629#1:7657,6\n629#1:7672,6\n629#1:7683\n699#1:7697,6\n699#1:7712,6\n710#1:7730,6\n710#1:7745,6\n710#1:7754\n699#1:7758\n979#1:7791,6\n979#1:7806,6\n979#1:7817\n949#1:7830,6\n949#1:7845,6\n949#1:7856\n1023#1:7880,6\n1023#1:7895,6\n1030#1:7913,6\n1030#1:7928,6\n1031#1:7945,6\n1031#1:7960,6\n1031#1:7970\n1041#1:7984,6\n1041#1:7999,6\n1041#1:8008\n1030#1:8012\n1023#1:8024\n1383#1:8063,6\n1383#1:8078,6\n1383#1:8087\n2135#1:8152,6\n2135#1:8167,6\n2166#1:8196,6\n2166#1:8211,6\n2172#1:8237,6\n2172#1:8252,6\n2172#1:8261\n2166#1:8266\n2189#1:8279,6\n2189#1:8294,6\n2189#1:8315\n2135#1:8319\n2224#1:8329,6\n2224#1:8344,6\n2237#1:8361,6\n2237#1:8376,6\n2243#1:8402,6\n2243#1:8417,6\n2243#1:8426\n2237#1:8431\n2326#1:8468,6\n2326#1:8483,6\n2326#1:8504\n2224#1:8508\n2358#1:8531,6\n2358#1:8546,6\n2411#1:8595,6\n2411#1:8610,6\n2411#1:8631\n2358#1:8635\n2497#1:8648,6\n2497#1:8663,6\n2497#1:8672\n2449#1:8700,6\n2449#1:8715,6\n2465#1:8750,6\n2465#1:8765,6\n2465#1:8788\n2564#1:8813,6\n2564#1:8828,6\n2564#1:8849\n2449#1:8853\n2602#1:8866,6\n2602#1:8881,6\n2631#1:8911,6\n2631#1:8926,6\n2631#1:8947\n2602#1:8951\n2666#1:8961,6\n2666#1:8976,6\n2799#1:9019,6\n2799#1:9034,6\n2799#1:9043\n2818#1:9055,6\n2818#1:9070,6\n2818#1:9091\n2666#1:9095\n2875#1:9146,6\n2875#1:9161,6\n2908#1:9185,6\n2908#1:9200,6\n2908#1:9209\n2917#1:9221,6\n2917#1:9236,6\n2917#1:9245\n2927#1:9257,6\n2927#1:9272,6\n2927#1:9281\n2987#1:9301,6\n2987#1:9316,6\n2987#1:9325\n2875#1:9343\n3072#1:9353,6\n3072#1:9368,6\n3127#1:9385,6\n3127#1:9400,6\n3133#1:9426,6\n3133#1:9441,6\n3133#1:9450\n3127#1:9455\n3148#1:9467,6\n3148#1:9482,6\n3154#1:9508,6\n3154#1:9523,6\n3154#1:9532\n3148#1:9537\n3169#1:9550,6\n3169#1:9565,6\n3169#1:9586\n3072#1:9590\n3282#1:9603,6\n3282#1:9618,6\n3282#1:9627\n3363#1:9646,6\n3363#1:9661,6\n3363#1:9670\n3367#1:9683,6\n3367#1:9698,6\n3367#1:9707\n3389#1:9723,6\n3389#1:9738,6\n3389#1:9747\n3346#1:9759,6\n3346#1:9774,6\n3347#1:9792,6\n3347#1:9807,6\n3349#1:9824,6\n3349#1:9839,6\n3349#1:9850\n3361#1:9859,6\n3361#1:9874,6\n3361#1:9898\n3373#1:9912,6\n3373#1:9927,6\n3373#1:9951\n3347#1:9955\n3346#1:9959\n3261#1:10000,6\n3261#1:10015,6\n3263#1:10029,6\n3263#1:10044,6\n3263#1:10061\n3289#1:10070,6\n3289#1:10085,6\n3294#1:10108,6\n3294#1:10123,6\n3294#1:10140\n3289#1:10144\n3319#1:10157,6\n3319#1:10172,6\n3319#1:10184\n3333#1:10196,6\n3333#1:10211,6\n3333#1:10220\n3404#1:10236,6\n3404#1:10251,6\n3409#1:10270,6\n3409#1:10285,6\n3409#1:10308\n3404#1:10320\n3261#1:10324\n3472#1:10374,6\n3472#1:10389,6\n3512#1:10419,6\n3512#1:10434,6\n3514#1:10453,6\n3514#1:10468,6\n3516#1:10493,6\n3516#1:10508,6\n3516#1:10517\n3514#1:10522\n3512#1:10527\n3543#1:10545,6\n3543#1:10560,6\n3543#1:10576\n3622#1:10602,6\n3622#1:10617,6\n3622#1:10626\n3628#1:10639,6\n3628#1:10654,6\n3628#1:10675\n3472#1:10679\n3680#1:10859,6\n3680#1:10874,6\n3686#1:10892,6\n3686#1:10907,6\n3686#1:10917\n3695#1:10930,6\n3695#1:10945,6\n3695#1:10955\n3680#1:10959\n3774#1:10978,6\n3774#1:10993,6\n3779#1:11009,6\n3779#1:11024,6\n3783#1:11037,6\n3783#1:11052,6\n3795#1:11071,6\n3795#1:11086,6\n3795#1:11104\n3783#1:11108\n3851#1:11121,6\n3851#1:11136,6\n3851#1:11145\n3779#1:11149\n3774#1:11153\n4006#1:11166,6\n4006#1:11181,6\n4006#1:11190\n3930#1:11204,6\n3930#1:11219,6\n4038#1:11251,6\n4038#1:11266,6\n4046#1:11283,6\n4046#1:11298,6\n4046#1:11307\n4038#1:11312\n3930#1:11322\n4090#1:11334,6\n4090#1:11349,6\n4096#1:11362,6\n4096#1:11377,6\n4101#1:11396,6\n4101#1:11411,6\n4101#1:11421\n4096#1:11425\n4167#1:11435,6\n4167#1:11450,6\n4181#1:11469,6\n4181#1:11484,6\n4186#1:11506,6\n4186#1:11521,6\n4186#1:11531\n4208#1:11548,6\n4208#1:11563,6\n4208#1:11572\n4181#1:11576\n4167#1:11582\n4090#1:11586\n4299#1:11614,6\n4299#1:11629,6\n4305#1:11642,6\n4305#1:11657,6\n4310#1:11675,6\n4310#1:11690,6\n4310#1:11699\n4305#1:11703\n4332#1:11716,6\n4332#1:11731,6\n4348#1:11752,6\n4348#1:11767,6\n4356#1:11798,6\n4356#1:11813,6\n4384#1:11831,6\n4384#1:11846,6\n4384#1:11855\n4356#1:11859\n4348#1:11864\n4332#1:11880\n4299#1:11893\n4544#1:11913,6\n4544#1:11928,6\n4544#1:11937\n300#1:4893,9\n300#1:4908\n305#1:4925,9\n305#1:4940\n307#1:4954,9\n307#1:4969\n315#1:4987,9\n315#1:5002\n325#1:5028,9\n325#1:5043,3\n315#1:5048,2\n356#1:5069,9\n356#1:5084\n356#1:5103,2\n307#1:5107,2\n379#1:5124,9\n379#1:5139\n395#1:5159,9\n395#1:5174\n396#1:5191,9\n396#1:5206\n396#1:5219,2\n421#1:5239,9\n421#1:5254\n421#1:5267,2\n395#1:5271,2\n379#1:5275,2\n452#1:5294,9\n452#1:5309,3\n465#1:5359,9\n465#1:5374\n465#1:5392,2\n600#1:5412,9\n600#1:5427\n676#1:5444,9\n676#1:5459\n678#1:5473,9\n678#1:5488\n729#1:5518,9\n729#1:5533\n762#1:5575,9\n762#1:5590\n762#1:5593,2\n729#1:5597,2\n678#1:5601,2\n792#1:5628,9\n792#1:5643\n806#1:5669,9\n806#1:5684,3\n792#1:5690,2\n829#1:5710,9\n829#1:5725\n831#1:5741,9\n831#1:5756,3\n835#1:5776,9\n835#1:5791\n836#1:5809,9\n836#1:5824\n836#1:5834,2\n835#1:5838,2\n848#1:5857,9\n848#1:5872,3\n896#1:5903,9\n896#1:5918\n902#1:5937,9\n902#1:5952\n902#1:5968,2\n896#1:5980,2\n829#1:5984,2\n676#1:5998,2\n1067#1:6018,9\n1067#1:6033\n1076#1:6053,9\n1076#1:6068\n1076#1:6079,2\n1114#1:6096,9\n1114#1:6111\n1114#1:6114,2\n1128#1:6135,9\n1128#1:6150\n1135#1:6166,9\n1135#1:6181,3\n1128#1:6194,2\n1256#1:6211,9\n1256#1:6226\n1256#1:6250,2\n1302#1:6268,9\n1302#1:6283\n1308#1:6301,9\n1308#1:6316\n1309#1:6342,9\n1309#1:6357\n1318#1:6375,9\n1318#1:6390\n1318#1:6393,2\n1309#1:6397,2\n1308#1:6409,2\n1358#1:6429,9\n1358#1:6444\n1358#1:6459,2\n1302#1:6490,2\n1466#1:6508,9\n1466#1:6523\n1480#1:6552,9\n1480#1:6567\n1480#1:6569,2\n1466#1:6592,2\n1543#1:6609,9\n1543#1:6624\n1551#1:6642,9\n1551#1:6657\n1551#1:6659,2\n1543#1:6663,2\n1558#1:6684,9\n1558#1:6699\n1558#1:6714,2\n1067#1:6718,2\n1624#1:6738,9\n1624#1:6753\n1630#1:6767,9\n1630#1:6782\n1645#1:6801,9\n1645#1:6816\n1645#1:6837,2\n1630#1:6841,2\n1685#1:6858,9\n1685#1:6873\n1685#1:6876,2\n1699#1:6897,9\n1699#1:6912\n1706#1:6928,9\n1706#1:6943,3\n1699#1:6956,2\n1767#1:6973,9\n1767#1:6988\n1844#1:7051,9\n1844#1:7066\n1844#1:7075,2\n1767#1:7079,2\n1896#1:7096,9\n1896#1:7111\n1904#1:7129,9\n1904#1:7144\n1904#1:7146,2\n1909#1:7168,9\n1909#1:7183\n1909#1:7212,2\n1896#1:7216,2\n1983#1:7237,9\n1983#1:7252\n1990#1:7269,9\n1990#1:7284\n1990#1:7306,2\n1983#1:7317,2\n1624#1:7321,2\n600#1:7325,2\n305#1:7419,2\n300#1:7423,2\n4254#1:7464,9\n4254#1:7479,3\n4566#1:7523,9\n4566#1:7538,3\n4583#1:7555,9\n4583#1:7570\n4583#1:7573,2\n644#1:7626,9\n644#1:7641,3\n629#1:7663,9\n629#1:7678\n629#1:7681,2\n699#1:7703,9\n699#1:7718\n710#1:7736,9\n710#1:7751,3\n699#1:7756,2\n979#1:7797,9\n979#1:7812\n979#1:7815,2\n949#1:7836,9\n949#1:7851\n949#1:7854,2\n1023#1:7886,9\n1023#1:7901\n1030#1:7919,9\n1030#1:7934\n1031#1:7951,9\n1031#1:7966\n1031#1:7968,2\n1041#1:7990,9\n1041#1:8005,3\n1030#1:8010,2\n1023#1:8022,2\n1383#1:8069,9\n1383#1:8084,3\n2135#1:8158,9\n2135#1:8173\n2166#1:8202,9\n2166#1:8217\n2172#1:8243,9\n2172#1:8258,3\n2166#1:8264,2\n2189#1:8285,9\n2189#1:8300\n2189#1:8313,2\n2135#1:8317,2\n2224#1:8335,9\n2224#1:8350\n2237#1:8367,9\n2237#1:8382\n2243#1:8408,9\n2243#1:8423,3\n2237#1:8429,2\n2326#1:8474,9\n2326#1:8489\n2326#1:8502,2\n2224#1:8506,2\n2358#1:8537,9\n2358#1:8552\n2411#1:8601,9\n2411#1:8616\n2411#1:8629,2\n2358#1:8633,2\n2497#1:8654,9\n2497#1:8669,3\n2449#1:8706,9\n2449#1:8721\n2465#1:8756,9\n2465#1:8771\n2465#1:8786,2\n2564#1:8819,9\n2564#1:8834\n2564#1:8847,2\n2449#1:8851,2\n2602#1:8872,9\n2602#1:8887\n2631#1:8917,9\n2631#1:8932\n2631#1:8945,2\n2602#1:8949,2\n2666#1:8967,9\n2666#1:8982\n2799#1:9025,9\n2799#1:9040,3\n2818#1:9061,9\n2818#1:9076\n2818#1:9089,2\n2666#1:9093,2\n2875#1:9152,9\n2875#1:9167\n2908#1:9191,9\n2908#1:9206,3\n2917#1:9227,9\n2917#1:9242,3\n2927#1:9263,9\n2927#1:9278,3\n2987#1:9307,9\n2987#1:9322,3\n2875#1:9341,2\n3072#1:9359,9\n3072#1:9374\n3127#1:9391,9\n3127#1:9406\n3133#1:9432,9\n3133#1:9447,3\n3127#1:9453,2\n3148#1:9473,9\n3148#1:9488\n3154#1:9514,9\n3154#1:9529,3\n3148#1:9535,2\n3169#1:9556,9\n3169#1:9571\n3169#1:9584,2\n3072#1:9588,2\n3282#1:9609,9\n3282#1:9624,3\n3363#1:9652,9\n3363#1:9667,3\n3367#1:9689,9\n3367#1:9704,3\n3389#1:9729,9\n3389#1:9744,3\n3346#1:9765,9\n3346#1:9780\n3347#1:9798,9\n3347#1:9813\n3349#1:9830,9\n3349#1:9845\n3349#1:9848,2\n3361#1:9865,9\n3361#1:9880\n3361#1:9896,2\n3373#1:9918,9\n3373#1:9933\n3373#1:9949,2\n3347#1:9953,2\n3346#1:9957,2\n3261#1:10006,9\n3261#1:10021\n3263#1:10035,9\n3263#1:10050\n3263#1:10059,2\n3289#1:10076,9\n3289#1:10091\n3294#1:10114,9\n3294#1:10129\n3294#1:10138,2\n3289#1:10142,2\n3319#1:10163,9\n3319#1:10178\n3319#1:10182,2\n3333#1:10202,9\n3333#1:10217,3\n3404#1:10242,9\n3404#1:10257\n3409#1:10276,9\n3409#1:10291\n3409#1:10306,2\n3404#1:10318,2\n3261#1:10322,2\n3472#1:10380,9\n3472#1:10395\n3512#1:10425,9\n3512#1:10440\n3514#1:10459,9\n3514#1:10474\n3516#1:10499,9\n3516#1:10514,3\n3514#1:10520,2\n3512#1:10525,2\n3543#1:10551,9\n3543#1:10566\n3543#1:10574,2\n3622#1:10608,9\n3622#1:10623,3\n3628#1:10645,9\n3628#1:10660\n3628#1:10673,2\n3472#1:10677,2\n3680#1:10865,9\n3680#1:10880\n3686#1:10898,9\n3686#1:10913\n3686#1:10915,2\n3695#1:10936,9\n3695#1:10951\n3695#1:10953,2\n3680#1:10957,2\n3774#1:10984,9\n3774#1:10999\n3779#1:11015,9\n3779#1:11030\n3783#1:11043,9\n3783#1:11058\n3795#1:11077,9\n3795#1:11092\n3795#1:11102,2\n3783#1:11106,2\n3851#1:11127,9\n3851#1:11142,3\n3779#1:11147,2\n3774#1:11151,2\n4006#1:11172,9\n4006#1:11187,3\n3930#1:11210,9\n3930#1:11225\n4038#1:11257,9\n4038#1:11272\n4046#1:11289,9\n4046#1:11304,3\n4038#1:11310,2\n3930#1:11320,2\n4090#1:11340,9\n4090#1:11355\n4096#1:11368,9\n4096#1:11383\n4101#1:11402,9\n4101#1:11417\n4101#1:11419,2\n4096#1:11423,2\n4167#1:11441,9\n4167#1:11456\n4181#1:11475,9\n4181#1:11490\n4186#1:11512,9\n4186#1:11527\n4186#1:11529,2\n4208#1:11554,9\n4208#1:11569,3\n4181#1:11574,2\n4167#1:11580,2\n4090#1:11584,2\n4299#1:11620,9\n4299#1:11635\n4305#1:11648,9\n4305#1:11663\n4310#1:11681,9\n4310#1:11696,3\n4305#1:11701,2\n4332#1:11722,9\n4332#1:11737\n4348#1:11758,9\n4348#1:11773\n4356#1:11804,9\n4356#1:11819\n4384#1:11837,9\n4384#1:11852,3\n4356#1:11857,2\n4348#1:11862,2\n4332#1:11878,2\n4299#1:11891,2\n4544#1:11919,9\n4544#1:11934,3\n305#1:4909\n305#1:4910,9\n379#1:5112,6\n395#1:5142\n395#1:5143,10\n395#1:5274\n379#1:5278\n465#1:5343\n465#1:5344,9\n465#1:5395\n600#1:5396\n600#1:5397,9\n676#1:5428\n676#1:5429,9\n729#1:5501\n729#1:5502,10\n729#1:5600\n836#1:5792\n836#1:5793,10\n836#1:5837\n902#1:5920\n902#1:5921,10\n902#1:5971\n676#1:6001\n1067#1:6002\n1067#1:6003,9\n1067#1:6721\n1624#1:6722\n1624#1:6723,9\n1983#1:7222\n1983#1:7223,8\n1983#1:7320\n1624#1:7324\n600#1:7328\n305#1:7422\n1041#1:7973\n1041#1:7974,10\n1041#1:8009\n1383#1:8053\n1383#1:8054,9\n1383#1:8088\n2135#1:8146,6\n2135#1:8320\n2224#1:8323,6\n2224#1:8509\n2358#1:8525,6\n2358#1:8636\n2497#1:8638\n2497#1:8639,9\n2497#1:8673\n2449#1:8694,6\n2449#1:8854\n2602#1:8860,6\n2602#1:8952\n2666#1:8955,6\n2799#1:9009\n2799#1:9010,9\n2799#1:9044\n2666#1:9096\n2875#1:9140,6\n2875#1:9344\n3072#1:9347,6\n3072#1:9591\n3346#1:9749\n3346#1:9750,9\n3349#1:9814\n3349#1:9815,9\n3349#1:9851\n3373#1:9902\n3373#1:9903,9\n3373#1:9952\n3346#1:9960\n3261#1:9989\n3261#1:9990,10\n3261#1:10325\n3472#1:10368,6\n3512#1:10410\n3512#1:10411,8\n3512#1:10528\n3543#1:10536\n3543#1:10537,8\n3543#1:10577\n3622#1:10593\n3622#1:10594,8\n3622#1:10627\n3472#1:10680\n3680#1:10850\n3680#1:10851,8\n3695#1:10919\n3695#1:10920,10\n3695#1:10956\n3680#1:10960\n3779#1:11000\n3779#1:11001,8\n3851#1:11110\n3851#1:11111,10\n3851#1:11146\n3779#1:11150\n4046#1:11273\n4046#1:11274,9\n4046#1:11308\n4090#1:11324\n4090#1:11325,9\n4090#1:11587\n4299#1:11604\n4299#1:11605,9\n4310#1:11664\n4310#1:11665,10\n4310#1:11700\n4332#1:11706\n4332#1:11707,9\n4384#1:11820\n4384#1:11821,10\n4384#1:11856\n4332#1:11881\n4299#1:11894\n311#1:4941\n319#1:5009\n323#1:5010\n382#1:5111\n392#1:5140\n395#1:5141\n398#1:5175\n423#1:5223\n472#1:5375\n473#1:5376\n502#1:5383\n503#1:5384\n504#1:5385\n682#1:5460\n694#1:5489\n695#1:5490\n696#1:5491\n697#1:5492\n727#1:5499\n731#1:5500\n757#1:5546\n764#1:5547\n778#1:5591\n779#1:5592\n796#1:5614\n797#1:5615\n809#1:5645\n811#1:5646\n813#1:5653\n837#1:5825\n838#1:5826\n840#1:5827\n855#1:5877\n856#1:5878\n857#1:5879\n899#1:5886\n904#1:5919\n908#1:5953\n910#1:5954\n928#1:5961\n943#1:5978\n944#1:5979\n1016#1:5988\n1018#1:5995\n1020#1:5996\n1021#1:5997\n1080#1:6040\n1103#1:6069\n1104#1:6070\n1106#1:6071\n1107#1:6072\n1118#1:6083\n1123#1:6112\n1124#1:6113\n1132#1:6118\n1149#1:6186\n1150#1:6187\n1257#1:6198\n1270#1:6233\n1279#1:6234\n1284#1:6241\n1293#1:6242\n1294#1:6249\n1303#1:6254\n1304#1:6255\n1311#1:6317\n1312#1:6318\n1313#1:6319\n1315#1:6326\n1320#1:6391\n1321#1:6392\n1330#1:6407\n1331#1:6408\n1377#1:6451\n1378#1:6452\n1440#1:6475\n1446#1:6482\n1459#1:6489\n1467#1:6494\n1468#1:6495\n1482#1:6530\n1501#1:6568\n1534#1:6591\n1547#1:6596\n1553#1:6658\n1559#1:6667\n1560#1:6668\n1581#1:6700\n1612#1:6707\n1634#1:6754\n1646#1:6783\n1653#1:6817\n1654#1:6818\n1656#1:6819\n1657#1:6820\n1665#1:6827\n1666#1:6828\n1668#1:6829\n1669#1:6830\n1689#1:6845\n1694#1:6874\n1695#1:6875\n1703#1:6880\n1720#1:6948\n1721#1:6949\n1771#1:6960\n1784#1:6995\n1793#1:6996\n1798#1:7003\n1807#1:7004\n1810#1:7011\n1819#1:7012\n1822#1:7019\n1831#1:7020\n1834#1:7027\n1843#1:7028\n1851#1:7073\n1854#1:7074\n1900#1:7083\n1906#1:7145\n1910#1:7150\n1915#1:7190\n1948#1:7197\n1959#1:7204\n1970#1:7211\n1987#1:7220\n1988#1:7221\n1992#1:7253\n2026#1:7285\n2063#1:7292\n2073#1:7299\n2110#1:7310\n3674#1:7427\n3676#1:7428\n3678#1:7429\n3760#1:7442\n3762#1:7443\n3768#1:7444\n3770#1:7445\n3899#1:7446\n3902#1:7447\n3903#1:7448\n3905#1:7449\n3924#1:7450\n3926#1:7451\n4524#1:7507\n4539#1:7508\n4541#1:7509\n4542#1:7510\n4594#1:7571\n4601#1:7572\n321#1:7577\n638#1:7679\n642#1:7680\n707#1:7719\n709#1:7720\n918#1:7778\n933#1:7779\n984#1:7813\n986#1:7814\n954#1:7852\n956#1:7853\n973#1:7864\n1026#1:7873\n1033#1:7935\n1038#1:7967\n1040#1:7972\n1054#1:8014\n1055#1:8015\n1276#1:8039\n1290#1:8040\n1295#1:8041\n1350#1:8043\n1351#1:8044\n1383#1:8052\n1442#1:8098\n1451#1:8099\n1584#1:8100\n1615#1:8101\n1790#1:8115\n1804#1:8116\n1816#1:8117\n1828#1:8118\n1840#1:8119\n1965#1:8120\n1976#1:8121\n2113#1:8122\n2136#1:8144\n2138#1:8145\n2168#1:8186\n2175#1:8219\n2177#1:8220\n2181#1:8227\n2190#1:8268\n2191#1:8269\n2225#1:8321\n2227#1:8322\n2239#1:8351\n2246#1:8384\n2248#1:8385\n2250#1:8392\n2327#1:8457\n2328#1:8458\n2359#1:8523\n2361#1:8524\n2385#1:8576\n2386#1:8577\n2412#1:8584\n2413#1:8585\n2497#1:8637\n2450#1:8692\n2452#1:8693\n2491#1:8778\n2492#1:8779\n2565#1:8802\n2566#1:8803\n2603#1:8858\n2605#1:8859\n2632#1:8900\n2633#1:8901\n2667#1:8953\n2669#1:8954\n2802#1:9005\n2803#1:9006\n2804#1:9007\n2806#1:9008\n2820#1:9045\n2876#1:9138\n2878#1:9139\n2893#1:9174\n2909#1:9175\n2918#1:9211\n2928#1:9247\n2935#1:9283\n2936#1:9284\n2988#1:9291\n2995#1:9327\n2996#1:9328\n3073#1:9345\n3075#1:9346\n3129#1:9375\n3136#1:9408\n3138#1:9409\n3140#1:9416\n3150#1:9457\n3157#1:9490\n3159#1:9491\n3161#1:9498\n3170#1:9539\n3171#1:9540\n3347#1:9781\n3361#1:9852\n3362#1:9881\n3365#1:9888\n3366#1:9889\n3371#1:9900\n3373#1:9901\n3378#1:9934\n3380#1:9941\n3387#1:9942\n3415#1:9987\n3426#1:9988\n3267#1:10022\n3273#1:10051\n3275#1:10052\n3290#1:10063\n3309#1:10130\n3311#1:10137\n3320#1:10146\n3324#1:10179\n3325#1:10180\n3326#1:10181\n3333#1:10186\n3337#1:10222\n3405#1:10229\n3409#1:10258\n3410#1:10292\n3417#1:10299\n3432#1:10310\n3433#1:10311\n3473#1:10366\n3475#1:10367\n3490#1:10402\n3512#1:10409\n3514#1:10441\n3519#1:10476\n3521#1:10483\n3528#1:10524\n3543#1:10535\n3552#1:10573\n3562#1:10584\n3563#1:10585\n3622#1:10592\n3629#1:10628\n3630#1:10629\n2130#1:10681\n2132#1:10682\n2133#1:10683\n2219#1:10684\n2221#1:10685\n2222#1:10686\n2353#1:10687\n2355#1:10688\n2356#1:10689\n2444#1:10690\n2446#1:10691\n2447#1:10692\n2597#1:10693\n2599#1:10694\n2600#1:10695\n2661#1:10696\n2663#1:10697\n2664#1:10698\n2870#1:10699\n2872#1:10700\n2873#1:10701\n3067#1:10702\n3069#1:10703\n3070#1:10704\n3254#1:10708\n3256#1:10709\n3259#1:10710\n3467#1:10711\n3469#1:10712\n3470#1:10713\n3683#1:10849\n3688#1:10881\n3689#1:10882\n3693#1:10914\n3697#1:10952\n3813#1:10961\n3828#1:10962\n3843#1:10963\n3777#1:10967\n3796#1:11059\n3805#1:11099\n3820#1:11100\n3835#1:11101\n4032#1:11192\n3933#1:11193\n3990#1:11238\n3992#1:11239\n4002#1:11240\n4004#1:11241\n4021#1:11242\n4025#1:11243\n4042#1:11244\n4072#1:11309\n4103#1:11384\n4108#1:11418\n4141#1:11427\n4153#1:11428\n4183#1:11457\n4197#1:11528\n4223#1:11578\n4224#1:11579\n4302#1:11603\n4329#1:11705\n4343#1:11739\n4349#1:11741\n4350#1:11742\n4359#1:11778\n4362#1:11779\n4364#1:11780\n4382#1:11787\n4405#1:11867\n4413#1:11869\n4421#1:11870\n4430#1:11871\n4436#1:11882\n4449#1:11889\n4450#1:11890\n4294#1:11901\n4295#1:11902\n4297#1:11903\n307#1:4942,6\n315#1:4970\n315#1:4971,10\n325#1:5011\n325#1:5012,10\n325#1:5047\n315#1:5051\n356#1:5052\n356#1:5053,10\n356#1:5106\n307#1:5110\n396#1:5176\n396#1:5177,8\n396#1:5222\n421#1:5224\n421#1:5225,8\n421#1:5270\n678#1:5461,6\n678#1:5604\n792#1:5616,6\n792#1:5693\n1076#1:6041,6\n1076#1:6082\n1114#1:6084,6\n1114#1:6117\n1256#1:6199,6\n1256#1:6253\n1302#1:6256,6\n1318#1:6358\n1318#1:6359,10\n1318#1:6396\n1302#1:6493\n1466#1:6496,6\n1466#1:6595\n1543#1:6597,6\n1551#1:6625\n1551#1:6626,10\n1551#1:6662\n1543#1:6666\n1558#1:6669\n1558#1:6670,8\n1558#1:6717\n1630#1:6755,6\n1645#1:6784\n1645#1:6785,10\n1645#1:6840\n1630#1:6844\n1685#1:6846,6\n1685#1:6879\n1767#1:6961,6\n1844#1:7035\n1844#1:7036,9\n1844#1:7078\n1767#1:7082\n1896#1:7084,6\n1904#1:7112\n1904#1:7113,10\n1904#1:7149\n1909#1:7151\n1909#1:7152,10\n1909#1:7215\n1896#1:7219\n1990#1:7254\n1990#1:7255,8\n1990#1:7309\n4254#1:7452,6\n4254#1:7483\n4566#1:7511,6\n4566#1:7542\n4583#1:7543,6\n4583#1:7576\n629#1:7646\n629#1:7647,10\n629#1:7684\n699#1:7687\n699#1:7688,9\n699#1:7759\n979#1:7780\n979#1:7781,10\n979#1:7818\n949#1:7819\n949#1:7820,10\n949#1:7857\n1023#1:7874,6\n1030#1:7902\n1030#1:7903,10\n1030#1:8013\n1023#1:8025\n2166#1:8187\n2166#1:8188,8\n2166#1:8267\n2189#1:8270\n2189#1:8271,8\n2189#1:8316\n2237#1:8352\n2237#1:8353,8\n2237#1:8432\n2326#1:8459\n2326#1:8460,8\n2326#1:8505\n2411#1:8586\n2411#1:8587,8\n2411#1:8632\n2564#1:8804\n2564#1:8805,8\n2564#1:8850\n2631#1:8902\n2631#1:8903,8\n2631#1:8948\n2818#1:9046\n2818#1:9047,8\n2818#1:9092\n3127#1:9376\n3127#1:9377,8\n3127#1:9456\n3148#1:9458\n3148#1:9459,8\n3148#1:9538\n3169#1:9541\n3169#1:9542,8\n3169#1:9587\n3347#1:9782\n3347#1:9783,9\n3361#1:9853,6\n3361#1:9899\n3347#1:9956\n3263#1:10023,6\n3263#1:10062\n3289#1:10064,6\n3294#1:10098\n3294#1:10099,9\n3294#1:10141\n3289#1:10145\n3319#1:10147\n3319#1:10148,9\n3319#1:10185\n3404#1:10230,6\n3409#1:10259\n3409#1:10260,10\n3409#1:10309\n3404#1:10321\n3514#1:10442\n3514#1:10443,10\n3514#1:10523\n3628#1:10630\n3628#1:10631,8\n3628#1:10676\n3783#1:11031,6\n3795#1:11060\n3795#1:11061,10\n3795#1:11105\n3783#1:11109\n4038#1:11245,6\n4038#1:11313\n4096#1:11356,6\n4101#1:11385\n4101#1:11386,10\n4101#1:11422\n4096#1:11426\n4167#1:11429,6\n4181#1:11458\n4181#1:11459,10\n4181#1:11577\n4167#1:11583\n4305#1:11636,6\n4305#1:11704\n4348#1:11743\n4348#1:11744,8\n4348#1:11865\n475#1:7578,13\n1152#1:8026,13\n1723#1:8102,13\n2388#1:8510,13\n2938#1:9097,13\n2998#1:9110,13\n3565#1:10326,13\n506#1:7591,18\n859#1:7760,18\n750#1:7685\n756#1:7686\n1370#1:8089\n2147#1:8141\n2147#1:8142,2\n2484#1:8674\n2461#1:8683\n2461#1:8684,2\n2462#1:8686\n2462#1:8687,2\n2463#1:8689\n2463#1:8690,2\n2614#1:8855\n2614#1:8856,2\n2887#1:9123\n2887#1:9124,2\n3484#1:10339\n3484#1:10340,2\n3511#1:10360\n3511#1:10361,2\n3538#1:10363\n3538#1:10364,2\n3244#1:10705\n3244#1:10706,2\n63#1:10714\n64#1:10715\n65#1:10716\n66#1:10717\n67#1:10718\n68#1:10719\n69#1:10720\n70#1:10721\n71#1:10722\n72#1:10723\n73#1:10724\n74#1:10725\n75#1:10726\n76#1:10727\n77#1:10728\n78#1:10729\n79#1:10730\n80#1:10731\n81#1:10732\n82#1:10733\n83#1:10734\n84#1:10735\n85#1:10736\n86#1:10737\n87#1:10738\n87#1:10739,2\n110#1:10741\n110#1:10742,2\n115#1:10744\n115#1:10745,2\n118#1:10747\n118#1:10748,2\n121#1:10750\n121#1:10751,2\n139#1:10753\n139#1:10754,2\n140#1:10756\n140#1:10757,2\n141#1:10759\n141#1:10760,2\n150#1:10762\n150#1:10763,2\n151#1:10765\n151#1:10766,2\n152#1:10768\n152#1:10769,2\n153#1:10771\n153#1:10772,2\n154#1:10774\n154#1:10775,2\n157#1:10777\n157#1:10778,2\n160#1:10780\n160#1:10781,2\n161#1:10783\n161#1:10784,2\n162#1:10786\n162#1:10787,2\n163#1:10789\n163#1:10790,2\n164#1:10792\n164#1:10793,2\n166#1:10795\n166#1:10796,2\n167#1:10798\n167#1:10799,2\n168#1:10801\n168#1:10802,2\n169#1:10804\n169#1:10805,2\n170#1:10807\n170#1:10808,2\n171#1:10810\n171#1:10811,2\n172#1:10813\n172#1:10814,2\n173#1:10816\n173#1:10817,2\n174#1:10819\n174#1:10820,2\n175#1:10822\n175#1:10823,2\n176#1:10825\n176#1:10826,2\n177#1:10828\n177#1:10829,2\n178#1:10831\n178#1:10832,2\n179#1:10834\n179#1:10835,2\n180#1:10837\n180#1:10838,2\n191#1:10840\n191#1:10841,2\n3725#1:10964\n3725#1:10965,2\n4282#1:11895\n4282#1:11896,2\n4283#1:11898\n4283#1:11899,2\n3418#1:9973\n3418#1:9974,6\n3941#1:11227,11\n*E\n"})
/* loaded from: C:\Users\Sajad\Desktop\SaSLoop\sasloop-android\app\build\intermediates\project_dex_archive\debug\dexBuilderDebug\out\com\example\sasloopmanager\BillingScreenKt.dex */
public final class BillingScreenKt {

    @NotNull
    private static final List<CountryCodeItem> countryCodes = CollectionsKt.listOf(new CountryCodeItem[]{new CountryCodeItem("IN", "+91", "🇮🇳", "India"), new CountryCodeItem("US", "+1", "🇺🇸", "United States"), new CountryCodeItem("GB", "+44", "🇬🇧", "United Kingdom"), new CountryCodeItem("AE", "+971", "🇦🇪", "United Arab Emirates"), new CountryCodeItem("SA", "+966", "🇸🇦", "Saudi Arabia"), new CountryCodeItem("QA", "+974", "🇶🇦", "Qatar"), new CountryCodeItem("OM", "+968", "🇴🇲", "Oman"), new CountryCodeItem("BH", "+973", "🇧🇭", "Bahrain"), new CountryCodeItem("KW", "+965", "🇰🇼", "Kuwait"), new CountryCodeItem("CA", "+1", "🇨🇦", "Canada"), new CountryCodeItem("AU", "+61", "🇦🇺", "Australia"), new CountryCodeItem("SG", "+65", "🇸🇬", "Singapore"), new CountryCodeItem("MY", "+60", "🇲🇾", "Malaysia"), new CountryCodeItem("PK", "+92", "🇵🇰", "Pakistan"), new CountryCodeItem("BD", "+880", "🇧🇩", "Bangladesh"), new CountryCodeItem("LK", "+94", "🇱🇰", "Sri Lanka"), new CountryCodeItem("NP", "+977", "🇳🇵", "Nepal"), new CountryCodeItem("DE", "+49", "🇩🇪", "Germany"), new CountryCodeItem("FR", "+33", "🇫🇷", "France"), new CountryCodeItem("IT", "+39", "🇮🇹", "Italy"), new CountryCodeItem("ES", "+34", "🇪🇸", "Spain"), new CountryCodeItem("NL", "+31", "🇳🇱", "Netherlands"), new CountryCodeItem("CH", "+41", "🇨🇭", "Switzerland"), new CountryCodeItem("SE", "+46", "🇸🇪", "Sweden"), new CountryCodeItem("NO", "+47", "🇳🇴", "Norway"), new CountryCodeItem("NZ", "+64", "🇳🇿", "New Zealand"), new CountryCodeItem("ZA", "+27", "🇿🇦", "South Africa"), new CountryCodeItem("JP", "+81", "🇯🇵", "Japan"), new CountryCodeItem("CN", "+86", "🇨🇳", "China")});

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit BillingScreen$lambda$141(BillingViewModel billingViewModel, UserProfile userProfile, int i, int i2, Composer composer, int i3) {
        BillingScreen(billingViewModel, userProfile, composer, RecomposeScopeImplKt.updateChangedFlags(i | 1), i2);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit CompactTextField_03iij_k$lambda$1(String str, Function1 function1, String str2, Modifier modifier, KeyboardOptions keyboardOptions, boolean z, long j, CornerBasedShape cornerBasedShape, int i, int i2, Composer composer, int i3) {
        m86CompactTextField03iij_k(str, function1, str2, modifier, keyboardOptions, z, j, cornerBasedShape, composer, RecomposeScopeImplKt.updateChangedFlags(i | 1), i2);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit FlowCard_FHprtrg$lambda$1(Modifier modifier, String str, String str2, ImageVector imageVector, long j, Function0 function0, int i, int i2, Composer composer, int i3) {
        m87FlowCardFHprtrg(modifier, str, str2, imageVector, j, function0, composer, RecomposeScopeImplKt.updateChangedFlags(i | 1), i2);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit ItemCustomizationDialog$lambda$8(MenuItem menuItem, List list, Function0 function0, Function2 function2, String str, int i, Composer composer, int i2) {
        ItemCustomizationDialog(menuItem, list, function0, function2, str, composer, RecomposeScopeImplKt.updateChangedFlags(i | 1));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit MenuItemCard$lambda$2(MenuItem menuItem, int i, int i2, Function0 function0, Function0 function02, boolean z, String str, boolean z2, int i3, boolean z3, boolean z4, boolean z5, int i4, int i5, int i6, Composer composer, int i7) {
        MenuItemCard(menuItem, i, i2, function0, function02, z, str, z2, i3, z3, z4, z5, composer, RecomposeScopeImplKt.updateChangedFlags(i4 | 1), RecomposeScopeImplKt.updateChangedFlags(i5), i6);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit ReceiptRow_6jM_SoI$lambda$1(String str, String str2, boolean z, long j, long j2, int i, int i2, Composer composer, int i3) {
        m88ReceiptRow6jMSoI(str, str2, z, j, j2, composer, RecomposeScopeImplKt.updateChangedFlags(i | 1), i2);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit TableCard$lambda$5(TableItem tableItem, String str, Double d, int i, Function0 function0, boolean z, boolean z2, String str2, int i2, boolean z3, boolean z4, Order order, Long l, boolean z5, int i3, int i4, int i5, Composer composer, int i6) {
        TableCard(tableItem, str, d, i, function0, z, z2, str2, i2, z3, z4, order, l, z5, composer, RecomposeScopeImplKt.updateChangedFlags(i3 | 1), RecomposeScopeImplKt.updateChangedFlags(i4), i5);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit ThermalGridRow$lambda$1(String str, String str2, int i, Composer composer, int i2) {
        ThermalGridRow(str, str2, composer, RecomposeScopeImplKt.updateChangedFlags(i | 1));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit ThermalReceiptRow_JHQioms$lambda$1(String str, String str2, boolean z, long j, int i, int i2, Composer composer, int i3) {
        m89ThermalReceiptRowJHQioms(str, str2, z, j, composer, RecomposeScopeImplKt.updateChangedFlags(i | 1), i2);
        return Unit.INSTANCE;
    }

    /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
    /* JADX WARN: Code restructure failed: missing block: B:1090:0x605f, code lost:
    
        if (r0 != androidx.compose.runtime.Composer.Companion.getEmpty()) goto L1256;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1188:0x6d1f, code lost:
    
        if (r5 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L1352;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1221:0x7015, code lost:
    
        if (r6 != androidx.compose.runtime.Composer.Companion.getEmpty()) goto L1391;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1258:0x78d7, code lost:
    
        if (r12 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L1456;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1304:0x822e, code lost:
    
        if (r0.changedInstance(r1) != false) goto L1514;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1309:0x8253, code lost:
    
        if (r6 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L1522;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1326:0x833a, code lost:
    
        if (r7 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L1545;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1331:0x842b, code lost:
    
        if (r10 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L1553;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1351:0x859c, code lost:
    
        if (r10 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L1582;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1362:0x8799, code lost:
    
        if (r3 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L1597;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1390:0x8a9f, code lost:
    
        if (r15 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L1635;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1430:0x90f5, code lost:
    
        if (r15.changedInstance(r408) == false) goto L1683;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1504:0x75dd, code lost:
    
        if (r256.changedInstance(r1) != false) goto L1425;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1650:0x9f9c, code lost:
    
        if (r0 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L1842;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1665:0xa038, code lost:
    
        if (r0 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L1863;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1686:0xa203, code lost:
    
        if (r0 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L1891;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1701:0xa29f, code lost:
    
        if (r0 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L1912;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1735:0x1ecc, code lost:
    
        if (r3 != androidx.compose.runtime.Composer.Companion.getEmpty()) goto L658;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1749:0x1f45, code lost:
    
        if (r3 != androidx.compose.runtime.Composer.Companion.getEmpty()) goto L677;
     */
    /* JADX WARN: Code restructure failed: missing block: B:345:0x19d2, code lost:
    
        if (r9 != androidx.compose.runtime.Composer.Companion.getEmpty()) goto L556;
     */
    /* JADX WARN: Code restructure failed: missing block: B:393:0x1e50, code lost:
    
        if (r3 != androidx.compose.runtime.Composer.Companion.getEmpty()) goto L638;
     */
    /* JADX WARN: Code restructure failed: missing block: B:483:0xa8c7, code lost:
    
        if (r2.changedInstance(r1) != false) goto L2008;
     */
    /* JADX WARN: Code restructure failed: missing block: B:645:0x319d, code lost:
    
        if (r11 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L809;
     */
    /* JADX WARN: Code restructure failed: missing block: B:659:0x33d4, code lost:
    
        if (r15 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L829;
     */
    /* JADX WARN: Code restructure failed: missing block: B:734:0x3cad, code lost:
    
        if (r7.changedInstance(r408) != false) goto L924;
     */
    /* JADX WARN: Code restructure failed: missing block: B:901:0x4f76, code lost:
    
        if (r3.changedInstance(r1) != false) goto L1057;
     */
    /* JADX WARN: Code restructure failed: missing block: B:937:0x534c, code lost:
    
        if (r6 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L1108;
     */
    /* JADX WARN: Multi-variable search skipped. Vars limit reached: 9354 (expected less than 5000) */
    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Removed duplicated region for block: B:1005:0x5b04  */
    /* JADX WARN: Removed duplicated region for block: B:1008:0x5b10  */
    /* JADX WARN: Removed duplicated region for block: B:1011:0x5b8b  */
    /* JADX WARN: Removed duplicated region for block: B:1020:0x64e6  */
    /* JADX WARN: Removed duplicated region for block: B:1023:0x64f2  */
    /* JADX WARN: Removed duplicated region for block: B:1026:0x6605  */
    /* JADX WARN: Removed duplicated region for block: B:1029:0x6611  */
    /* JADX WARN: Removed duplicated region for block: B:102:0x083c  */
    /* JADX WARN: Removed duplicated region for block: B:1032:0x669d  */
    /* JADX WARN: Removed duplicated region for block: B:1038:0x67ce  */
    /* JADX WARN: Removed duplicated region for block: B:1041:0x6854  */
    /* JADX WARN: Removed duplicated region for block: B:1044:0x694d  */
    /* JADX WARN: Removed duplicated region for block: B:1056:0x6a8b  */
    /* JADX WARN: Removed duplicated region for block: B:1057:0x67dc  */
    /* JADX WARN: Removed duplicated region for block: B:1059:0x677c  */
    /* JADX WARN: Removed duplicated region for block: B:1060:0x6617  */
    /* JADX WARN: Removed duplicated region for block: B:1061:0x64f8  */
    /* JADX WARN: Removed duplicated region for block: B:1063:0x5d1b  */
    /* JADX WARN: Removed duplicated region for block: B:107:0x08b4  */
    /* JADX WARN: Removed duplicated region for block: B:1127:0x5b16  */
    /* JADX WARN: Removed duplicated region for block: B:1129:0x5a74  */
    /* JADX WARN: Removed duplicated region for block: B:112:0x092e  */
    /* JADX WARN: Removed duplicated region for block: B:1132:0x5588  */
    /* JADX WARN: Removed duplicated region for block: B:1139:0x559e  */
    /* JADX WARN: Removed duplicated region for block: B:1152:0x55d0 A[SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:1154:? A[LOOP:5: B:1137:0x5598->B:1154:?, LOOP_END, SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:1158:0x55d3 A[SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:1160:0x5412  */
    /* JADX WARN: Removed duplicated region for block: B:1161:0x5350  */
    /* JADX WARN: Removed duplicated region for block: B:1162:0x5295  */
    /* JADX WARN: Removed duplicated region for block: B:1163:0x525b  */
    /* JADX WARN: Removed duplicated region for block: B:1165:0x51c8 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1166:0x5189  */
    /* JADX WARN: Removed duplicated region for block: B:1167:0x5141  */
    /* JADX WARN: Removed duplicated region for block: B:1168:0x50b6  */
    /* JADX WARN: Removed duplicated region for block: B:1170:0x4f9d  */
    /* JADX WARN: Removed duplicated region for block: B:117:0x098b  */
    /* JADX WARN: Removed duplicated region for block: B:122:0x09e9  */
    /* JADX WARN: Removed duplicated region for block: B:1257:0x78cf  */
    /* JADX WARN: Removed duplicated region for block: B:1262:0x7955  */
    /* JADX WARN: Removed duplicated region for block: B:1265:0x7a8a  */
    /* JADX WARN: Removed duplicated region for block: B:1268:0x7a96  */
    /* JADX WARN: Removed duplicated region for block: B:1271:0x7b8b  */
    /* JADX WARN: Removed duplicated region for block: B:1274:0x7b97  */
    /* JADX WARN: Removed duplicated region for block: B:1277:0x7c77  */
    /* JADX WARN: Removed duplicated region for block: B:127:0x0a48  */
    /* JADX WARN: Removed duplicated region for block: B:1280:0x7d3f  */
    /* JADX WARN: Removed duplicated region for block: B:1283:0x7d4b  */
    /* JADX WARN: Removed duplicated region for block: B:1286:0x7e70  */
    /* JADX WARN: Removed duplicated region for block: B:1289:0x7e7c  */
    /* JADX WARN: Removed duplicated region for block: B:1292:0x8017  */
    /* JADX WARN: Removed duplicated region for block: B:1295:0x815e  */
    /* JADX WARN: Removed duplicated region for block: B:1298:0x816a  */
    /* JADX WARN: Removed duplicated region for block: B:1301:0x8224  */
    /* JADX WARN: Removed duplicated region for block: B:1308:0x824a  */
    /* JADX WARN: Removed duplicated region for block: B:1313:0x82a1  */
    /* JADX WARN: Removed duplicated region for block: B:1318:0x8318  */
    /* JADX WARN: Removed duplicated region for block: B:1325:0x8331  */
    /* JADX WARN: Removed duplicated region for block: B:132:0x0aa2  */
    /* JADX WARN: Removed duplicated region for block: B:1330:0x8422  */
    /* JADX WARN: Removed duplicated region for block: B:1335:0x8481  */
    /* JADX WARN: Removed duplicated region for block: B:1342:0x84a6  */
    /* JADX WARN: Removed duplicated region for block: B:1347:0x8521  */
    /* JADX WARN: Removed duplicated region for block: B:1350:0x8593  */
    /* JADX WARN: Removed duplicated region for block: B:1355:0x86e9  */
    /* JADX WARN: Removed duplicated region for block: B:1358:0x86f5  */
    /* JADX WARN: Removed duplicated region for block: B:1361:0x8791  */
    /* JADX WARN: Removed duplicated region for block: B:1366:0x881f  */
    /* JADX WARN: Removed duplicated region for block: B:1373:0x884c  */
    /* JADX WARN: Removed duplicated region for block: B:1378:0x891e  */
    /* JADX WARN: Removed duplicated region for block: B:137:0x0aea  */
    /* JADX WARN: Removed duplicated region for block: B:1381:0x892a  */
    /* JADX WARN: Removed duplicated region for block: B:1384:0x8a09  */
    /* JADX WARN: Removed duplicated region for block: B:1389:0x8a97  */
    /* JADX WARN: Removed duplicated region for block: B:1394:0x8b0b  */
    /* JADX WARN: Removed duplicated region for block: B:1400:0x8ba6 A[LOOP:7: B:1398:0x8ba0->B:1400:0x8ba6, LOOP_END] */
    /* JADX WARN: Removed duplicated region for block: B:1404:0x8bd7  */
    /* JADX WARN: Removed duplicated region for block: B:1407:0x8c93  */
    /* JADX WARN: Removed duplicated region for block: B:140:0x0b27  */
    /* JADX WARN: Removed duplicated region for block: B:1410:0x8c9f  */
    /* JADX WARN: Removed duplicated region for block: B:1413:0x8daa  */
    /* JADX WARN: Removed duplicated region for block: B:1416:0x8db6  */
    /* JADX WARN: Removed duplicated region for block: B:1419:0x8ff3  */
    /* JADX WARN: Removed duplicated region for block: B:1422:0x8fff  */
    /* JADX WARN: Removed duplicated region for block: B:1425:0x9079  */
    /* JADX WARN: Removed duplicated region for block: B:1434:0x913f  */
    /* JADX WARN: Removed duplicated region for block: B:143:0x0b65  */
    /* JADX WARN: Removed duplicated region for block: B:1440:0x92ad  */
    /* JADX WARN: Removed duplicated region for block: B:1447:0x92f0  */
    /* JADX WARN: Removed duplicated region for block: B:1452:0x9311  */
    /* JADX WARN: Removed duplicated region for block: B:1455:0x9180  */
    /* JADX WARN: Removed duplicated region for block: B:1459:0x9213  */
    /* JADX WARN: Removed duplicated region for block: B:1460:0x9005  */
    /* JADX WARN: Removed duplicated region for block: B:1461:0x8dbc  */
    /* JADX WARN: Removed duplicated region for block: B:1462:0x8ca5  */
    /* JADX WARN: Removed duplicated region for block: B:1463:0x8bda  */
    /* JADX WARN: Removed duplicated region for block: B:1465:0x8b21 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1466:0x8aa3  */
    /* JADX WARN: Removed duplicated region for block: B:1468:0x8930  */
    /* JADX WARN: Removed duplicated region for block: B:146:0x0ba2  */
    /* JADX WARN: Removed duplicated region for block: B:1471:0x879d  */
    /* JADX WARN: Removed duplicated region for block: B:1472:0x86fb  */
    /* JADX WARN: Removed duplicated region for block: B:1473:0x85a0  */
    /* JADX WARN: Removed duplicated region for block: B:1474:0x8533  */
    /* JADX WARN: Removed duplicated region for block: B:1476:0x84b6 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1478:0x842f  */
    /* JADX WARN: Removed duplicated region for block: B:1479:0x833e  */
    /* JADX WARN: Removed duplicated region for block: B:1482:0x8257  */
    /* JADX WARN: Removed duplicated region for block: B:1485:0x8236  */
    /* JADX WARN: Removed duplicated region for block: B:1486:0x816e  */
    /* JADX WARN: Removed duplicated region for block: B:1487:0x8026  */
    /* JADX WARN: Removed duplicated region for block: B:1488:0x7e82  */
    /* JADX WARN: Removed duplicated region for block: B:1489:0x7d51  */
    /* JADX WARN: Removed duplicated region for block: B:1490:0x7c89  */
    /* JADX WARN: Removed duplicated region for block: B:1491:0x7b9d  */
    /* JADX WARN: Removed duplicated region for block: B:1492:0x7a9c  */
    /* JADX WARN: Removed duplicated region for block: B:1493:0x7967  */
    /* JADX WARN: Removed duplicated region for block: B:1494:0x78db  */
    /* JADX WARN: Removed duplicated region for block: B:149:0x0bdf  */
    /* JADX WARN: Removed duplicated region for block: B:152:0x0c1c  */
    /* JADX WARN: Removed duplicated region for block: B:1532:0x93f3  */
    /* JADX WARN: Removed duplicated region for block: B:155:0x0c59  */
    /* JADX WARN: Removed duplicated region for block: B:1573:0x9a00  */
    /* JADX WARN: Removed duplicated region for block: B:1580:0x9a25  */
    /* JADX WARN: Removed duplicated region for block: B:1585:0x9a4e  */
    /* JADX WARN: Removed duplicated region for block: B:158:0x0c96  */
    /* JADX WARN: Removed duplicated region for block: B:161:0x0cd4  */
    /* JADX WARN: Removed duplicated region for block: B:1620:0x9acd  */
    /* JADX WARN: Removed duplicated region for block: B:164:0x0d11  */
    /* JADX WARN: Removed duplicated region for block: B:167:0x0d4e  */
    /* JADX WARN: Removed duplicated region for block: B:170:0x0da2  */
    /* JADX WARN: Removed duplicated region for block: B:1723:0x1e89  */
    /* JADX WARN: Removed duplicated region for block: B:1759:0x1d9a  */
    /* JADX WARN: Removed duplicated region for block: B:175:0x0e00  */
    /* JADX WARN: Removed duplicated region for block: B:1761:0x1c54  */
    /* JADX WARN: Removed duplicated region for block: B:1781:0x1be9  */
    /* JADX WARN: Removed duplicated region for block: B:1782:0x1bf0  */
    /* JADX WARN: Removed duplicated region for block: B:1783:0x1ae8  */
    /* JADX WARN: Removed duplicated region for block: B:1786:0x1a3e  */
    /* JADX WARN: Removed duplicated region for block: B:1787:0x191a  */
    /* JADX WARN: Removed duplicated region for block: B:1788:0x1802  */
    /* JADX WARN: Removed duplicated region for block: B:1789:0x16c0  */
    /* JADX WARN: Removed duplicated region for block: B:1790:0x15b1  */
    /* JADX WARN: Removed duplicated region for block: B:1793:0x14eb  */
    /* JADX WARN: Removed duplicated region for block: B:1796:0x13d4  */
    /* JADX WARN: Removed duplicated region for block: B:1798:0x13e8  */
    /* JADX WARN: Removed duplicated region for block: B:1803:0x11be A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1805:0x1100  */
    /* JADX WARN: Removed duplicated region for block: B:1808:0x104d  */
    /* JADX WARN: Removed duplicated region for block: B:180:0x0e5e  */
    /* JADX WARN: Removed duplicated region for block: B:1810:0x0f9c  */
    /* JADX WARN: Removed duplicated region for block: B:1814:0x0f19  */
    /* JADX WARN: Removed duplicated region for block: B:1823:0x0ef8 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1824:0x0ebd  */
    /* JADX WARN: Removed duplicated region for block: B:1826:0x0e6c A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1828:0x0e0e A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1830:0x0db0 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1831:0x0d66  */
    /* JADX WARN: Removed duplicated region for block: B:1832:0x0d29  */
    /* JADX WARN: Removed duplicated region for block: B:1833:0x0cec  */
    /* JADX WARN: Removed duplicated region for block: B:1834:0x0cae  */
    /* JADX WARN: Removed duplicated region for block: B:1835:0x0c71  */
    /* JADX WARN: Removed duplicated region for block: B:1836:0x0c34  */
    /* JADX WARN: Removed duplicated region for block: B:1837:0x0bf7  */
    /* JADX WARN: Removed duplicated region for block: B:1838:0x0bba  */
    /* JADX WARN: Removed duplicated region for block: B:1839:0x0b7d  */
    /* JADX WARN: Removed duplicated region for block: B:1840:0x0b3f  */
    /* JADX WARN: Removed duplicated region for block: B:1841:0x0b02  */
    /* JADX WARN: Removed duplicated region for block: B:1843:0x0ab0 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1845:0x0a56 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1847:0x09f7 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1849:0x0999 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1851:0x093c A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1853:0x08c2 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1856:0x07eb A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1858:0x078e A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:185:0x0ea5  */
    /* JADX WARN: Removed duplicated region for block: B:1860:0x0731 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1862:0x06d3 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1865:0x066e  */
    /* JADX WARN: Removed duplicated region for block: B:1867:0x0671  */
    /* JADX WARN: Removed duplicated region for block: B:1871:0x065b A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1873:0x05fe A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1875:0x05a0 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1878:0x04fc  */
    /* JADX WARN: Removed duplicated region for block: B:188:0x0eea  */
    /* JADX WARN: Removed duplicated region for block: B:1895:0x0546  */
    /* JADX WARN: Removed duplicated region for block: B:1896:0x04eb A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:193:0x0f84  */
    /* JADX WARN: Removed duplicated region for block: B:196:0x0fd2  */
    /* JADX WARN: Removed duplicated region for block: B:203:0x0fef  */
    /* JADX WARN: Removed duplicated region for block: B:208:0x10d1  */
    /* JADX WARN: Removed duplicated region for block: B:215:0x10f0  */
    /* JADX WARN: Removed duplicated region for block: B:220:0x119b  */
    /* JADX WARN: Removed duplicated region for block: B:226:0x1223  */
    /* JADX WARN: Removed duplicated region for block: B:239:0x1298  */
    /* JADX WARN: Removed duplicated region for block: B:246:0x12f0  */
    /* JADX WARN: Removed duplicated region for block: B:250:0x131d  */
    /* JADX WARN: Removed duplicated region for block: B:262:0x135a  */
    /* JADX WARN: Removed duplicated region for block: B:264:0x1364 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:268:0x136f  */
    /* JADX WARN: Removed duplicated region for block: B:271:0x1372 A[SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:276:0x135d  */
    /* JADX WARN: Removed duplicated region for block: B:278:0x12f8  */
    /* JADX WARN: Removed duplicated region for block: B:283:0x12d8  */
    /* JADX WARN: Removed duplicated region for block: B:291:0x13b3  */
    /* JADX WARN: Removed duplicated region for block: B:296:0x1420  */
    /* JADX WARN: Removed duplicated region for block: B:311:0x15a1  */
    /* JADX WARN: Removed duplicated region for block: B:314:0x15ad  */
    /* JADX WARN: Removed duplicated region for block: B:317:0x16ae  */
    /* JADX WARN: Removed duplicated region for block: B:320:0x16ba  */
    /* JADX WARN: Removed duplicated region for block: B:323:0x17f0  */
    /* JADX WARN: Removed duplicated region for block: B:326:0x17fc  */
    /* JADX WARN: Removed duplicated region for block: B:329:0x1908  */
    /* JADX WARN: Removed duplicated region for block: B:332:0x1914  */
    /* JADX WARN: Removed duplicated region for block: B:335:0x1997  */
    /* JADX WARN: Removed duplicated region for block: B:350:0x1ad6  */
    /* JADX WARN: Removed duplicated region for block: B:353:0x1ae2  */
    /* JADX WARN: Removed duplicated region for block: B:356:0x1b6e  */
    /* JADX WARN: Removed duplicated region for block: B:358:0x1b74  */
    /* JADX WARN: Removed duplicated region for block: B:364:0x1c3d  */
    /* JADX WARN: Removed duplicated region for block: B:368:0x1c4f  */
    /* JADX WARN: Removed duplicated region for block: B:370:0x1c57  */
    /* JADX WARN: Removed duplicated region for block: B:377:0x1d88  */
    /* JADX WARN: Removed duplicated region for block: B:380:0x1d94  */
    /* JADX WARN: Removed duplicated region for block: B:383:0x1e15  */
    /* JADX WARN: Removed duplicated region for block: B:398:0x1fdf  */
    /* JADX WARN: Removed duplicated region for block: B:400:0x1fef  */
    /* JADX WARN: Removed duplicated region for block: B:418:0xa324  */
    /* JADX WARN: Removed duplicated region for block: B:424:0xa3b1  */
    /* JADX WARN: Removed duplicated region for block: B:430:0xa446  */
    /* JADX WARN: Removed duplicated region for block: B:436:0xa4cf  */
    /* JADX WARN: Removed duplicated region for block: B:451:0xa59f  */
    /* JADX WARN: Removed duplicated region for block: B:457:0xa628  */
    /* JADX WARN: Removed duplicated region for block: B:463:0xa6f9  */
    /* JADX WARN: Removed duplicated region for block: B:469:0xa790  */
    /* JADX WARN: Removed duplicated region for block: B:475:0xa872  */
    /* JADX WARN: Removed duplicated region for block: B:492:0xa932  */
    /* JADX WARN: Removed duplicated region for block: B:507:0xaaca  */
    /* JADX WARN: Removed duplicated region for block: B:538:0xac6b  */
    /* JADX WARN: Removed duplicated region for block: B:547:0xac26  */
    /* JADX WARN: Removed duplicated region for block: B:551:0xaaae  */
    /* JADX WARN: Removed duplicated region for block: B:557:0xa91a  */
    /* JADX WARN: Removed duplicated region for block: B:559:0xa847  */
    /* JADX WARN: Removed duplicated region for block: B:561:0xa779  */
    /* JADX WARN: Removed duplicated region for block: B:563:0xa6d5  */
    /* JADX WARN: Removed duplicated region for block: B:565:0xa616  */
    /* JADX WARN: Removed duplicated region for block: B:568:0xa57a  */
    /* JADX WARN: Removed duplicated region for block: B:570:0xa4b9  */
    /* JADX WARN: Removed duplicated region for block: B:572:0xa42f  */
    /* JADX WARN: Removed duplicated region for block: B:574:0xa39a  */
    /* JADX WARN: Removed duplicated region for block: B:62:0x04dc  */
    /* JADX WARN: Removed duplicated region for block: B:644:0x3195  */
    /* JADX WARN: Removed duplicated region for block: B:649:0x321b  */
    /* JADX WARN: Removed duplicated region for block: B:652:0x32a0  */
    /* JADX WARN: Removed duplicated region for block: B:655:0x333b  */
    /* JADX WARN: Removed duplicated region for block: B:658:0x33cc  */
    /* JADX WARN: Removed duplicated region for block: B:663:0x348a  */
    /* JADX WARN: Removed duplicated region for block: B:666:0x3496  */
    /* JADX WARN: Removed duplicated region for block: B:675:0x363b A[LOOP:2: B:673:0x3635->B:675:0x363b, LOOP_END] */
    /* JADX WARN: Removed duplicated region for block: B:679:0x3668  */
    /* JADX WARN: Removed duplicated region for block: B:67:0x0592  */
    /* JADX WARN: Removed duplicated region for block: B:682:0x368d  */
    /* JADX WARN: Removed duplicated region for block: B:685:0x36b0  */
    /* JADX WARN: Removed duplicated region for block: B:690:0x36d9  */
    /* JADX WARN: Removed duplicated region for block: B:693:0x36f0  */
    /* JADX WARN: Removed duplicated region for block: B:698:0x3707  */
    /* JADX WARN: Removed duplicated region for block: B:701:0x372c  */
    /* JADX WARN: Removed duplicated region for block: B:704:0x373d  */
    /* JADX WARN: Removed duplicated region for block: B:707:0x3750  */
    /* JADX WARN: Removed duplicated region for block: B:710:0x3820  */
    /* JADX WARN: Removed duplicated region for block: B:713:0x382c  */
    /* JADX WARN: Removed duplicated region for block: B:716:0x3943  */
    /* JADX WARN: Removed duplicated region for block: B:719:0x394f  */
    /* JADX WARN: Removed duplicated region for block: B:722:0x3b91  */
    /* JADX WARN: Removed duplicated region for block: B:725:0x3b9d  */
    /* JADX WARN: Removed duplicated region for block: B:728:0x3c35  */
    /* JADX WARN: Removed duplicated region for block: B:72:0x05f0  */
    /* JADX WARN: Removed duplicated region for block: B:731:0x3ca1  */
    /* JADX WARN: Removed duplicated region for block: B:738:0x3d6a  */
    /* JADX WARN: Removed duplicated region for block: B:741:0x3d7f  */
    /* JADX WARN: Removed duplicated region for block: B:746:0x3fb8  */
    /* JADX WARN: Removed duplicated region for block: B:749:0x4044  */
    /* JADX WARN: Removed duplicated region for block: B:752:0x41a7  */
    /* JADX WARN: Removed duplicated region for block: B:755:0x41b3  */
    /* JADX WARN: Removed duplicated region for block: B:758:0x42c6  */
    /* JADX WARN: Removed duplicated region for block: B:761:0x42d2  */
    /* JADX WARN: Removed duplicated region for block: B:764:0x4353  */
    /* JADX WARN: Removed duplicated region for block: B:77:0x064d  */
    /* JADX WARN: Removed duplicated region for block: B:782:0x4677  */
    /* JADX WARN: Removed duplicated region for block: B:789:0x46f7  */
    /* JADX WARN: Removed duplicated region for block: B:792:0x4711  */
    /* JADX WARN: Removed duplicated region for block: B:797:0x4870  */
    /* JADX WARN: Removed duplicated region for block: B:800:0x4959  */
    /* JADX WARN: Removed duplicated region for block: B:807:0x49d2  */
    /* JADX WARN: Removed duplicated region for block: B:810:0x49ec  */
    /* JADX WARN: Removed duplicated region for block: B:815:0x4a20  */
    /* JADX WARN: Removed duplicated region for block: B:816:0x49d5  */
    /* JADX WARN: Removed duplicated region for block: B:818:0x4882  */
    /* JADX WARN: Removed duplicated region for block: B:820:0x46fa  */
    /* JADX WARN: Removed duplicated region for block: B:826:0x45a6  */
    /* JADX WARN: Removed duplicated region for block: B:827:0x42d8  */
    /* JADX WARN: Removed duplicated region for block: B:828:0x41b9  */
    /* JADX WARN: Removed duplicated region for block: B:829:0x4056  */
    /* JADX WARN: Removed duplicated region for block: B:82:0x06c5  */
    /* JADX WARN: Removed duplicated region for block: B:830:0x3fc8  */
    /* JADX WARN: Removed duplicated region for block: B:832:0x3e46  */
    /* JADX WARN: Removed duplicated region for block: B:833:0x3d6d  */
    /* JADX WARN: Removed duplicated region for block: B:836:0x3cb7  */
    /* JADX WARN: Removed duplicated region for block: B:837:0x3c49  */
    /* JADX WARN: Removed duplicated region for block: B:838:0x3ba3  */
    /* JADX WARN: Removed duplicated region for block: B:839:0x3955  */
    /* JADX WARN: Removed duplicated region for block: B:840:0x3832  */
    /* JADX WARN: Removed duplicated region for block: B:841:0x3755  */
    /* JADX WARN: Removed duplicated region for block: B:842:0x3742  */
    /* JADX WARN: Removed duplicated region for block: B:843:0x372f  */
    /* JADX WARN: Removed duplicated region for block: B:844:0x3714  */
    /* JADX WARN: Removed duplicated region for block: B:846:0x36e0  */
    /* JADX WARN: Removed duplicated region for block: B:848:0x3696  */
    /* JADX WARN: Removed duplicated region for block: B:849:0x366d  */
    /* JADX WARN: Removed duplicated region for block: B:852:0x349c  */
    /* JADX WARN: Removed duplicated region for block: B:853:0x33d8  */
    /* JADX WARN: Removed duplicated region for block: B:854:0x334d  */
    /* JADX WARN: Removed duplicated region for block: B:855:0x32b2  */
    /* JADX WARN: Removed duplicated region for block: B:856:0x322e  */
    /* JADX WARN: Removed duplicated region for block: B:857:0x31a1  */
    /* JADX WARN: Removed duplicated region for block: B:87:0x0723  */
    /* JADX WARN: Removed duplicated region for block: B:905:0x4f8e  */
    /* JADX WARN: Removed duplicated region for block: B:910:0x50a4  */
    /* JADX WARN: Removed duplicated region for block: B:913:0x50b0  */
    /* JADX WARN: Removed duplicated region for block: B:916:0x513c  */
    /* JADX WARN: Removed duplicated region for block: B:919:0x517a  */
    /* JADX WARN: Removed duplicated region for block: B:922:0x51ba  */
    /* JADX WARN: Removed duplicated region for block: B:927:0x5256  */
    /* JADX WARN: Removed duplicated region for block: B:92:0x0780  */
    /* JADX WARN: Removed duplicated region for block: B:930:0x528b  */
    /* JADX WARN: Removed duplicated region for block: B:933:0x5313  */
    /* JADX WARN: Removed duplicated region for block: B:936:0x5343  */
    /* JADX WARN: Removed duplicated region for block: B:941:0x5400  */
    /* JADX WARN: Removed duplicated region for block: B:944:0x540c  */
    /* JADX WARN: Removed duplicated region for block: B:947:0x5564  */
    /* JADX WARN: Removed duplicated region for block: B:952:0x55eb  */
    /* JADX WARN: Removed duplicated region for block: B:97:0x07dd  */
    /* JADX WARN: Type inference failed for: r0v1089, types: [boolean] */
    /* JADX WARN: Type inference failed for: r11v334, types: [boolean] */
    /* JADX WARN: Type inference failed for: r11v338, types: [boolean] */
    /* JADX WARN: Type inference failed for: r12v312, types: [boolean] */
    /* JADX WARN: Type inference failed for: r133v2, types: [boolean] */
    /* JADX WARN: Type inference failed for: r133v40 */
    /* JADX WARN: Type inference failed for: r133v41 */
    /* JADX WARN: Type inference failed for: r14v162, types: [boolean] */
    /* JADX WARN: Type inference failed for: r14v182, types: [boolean] */
    /* JADX WARN: Type inference failed for: r271v2, types: [boolean] */
    /* JADX WARN: Type inference failed for: r271v78 */
    /* JADX WARN: Type inference failed for: r271v79 */
    /* JADX WARN: Type inference failed for: r271v80 */
    /* JADX WARN: Type inference failed for: r311v11, types: [boolean] */
    /* JADX WARN: Type inference failed for: r311v14, types: [boolean] */
    /* JADX WARN: Type inference failed for: r311v9, types: [boolean] */
    /* JADX WARN: Type inference failed for: r4v414 */
    /* JADX WARN: Type inference failed for: r4v415 */
    /* JADX WARN: Type inference failed for: r4v416, types: [boolean] */
    /* JADX WARN: Type inference failed for: r4v418 */
    /* JADX WARN: Type inference failed for: r6v56 */
    /* JADX WARN: Type inference failed for: r6v57 */
    /* JADX WARN: Type inference failed for: r6v88, types: [boolean] */
    /* JADX WARN: Type inference failed for: r6v92, types: [boolean] */
    /* JADX WARN: Type inference failed for: r6v96, types: [boolean] */
    /* JADX WARN: Type inference failed for: r7v464, types: [boolean] */
    @androidx.compose.runtime.ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @androidx.compose.runtime.Composable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final void BillingScreen(@org.jetbrains.annotations.NotNull final com.example.sasloopmanager.BillingViewModel r408, @org.jetbrains.annotations.Nullable com.example.sasloopmanager.data.UserProfile r409, @org.jetbrains.annotations.Nullable androidx.compose.runtime.Composer r410, final int r411, final int r412) {
        /*
            Method dump skipped, instructions count: 44246
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen(com.example.sasloopmanager.BillingViewModel, com.example.sasloopmanager.data.UserProfile, androidx.compose.runtime.Composer, int, int):void");
    }

    private static final List<MenuItem> BillingScreen$lambda$0(State<? extends List<MenuItem>> state) {
        return (List) state.getValue();
    }

    private static final List<CategoryItem> BillingScreen$lambda$1(State<? extends List<CategoryItem>> state) {
        return (List) state.getValue();
    }

    private static final String BillingScreen$lambda$2(State<String> state) {
        return (String) state.getValue();
    }

    private static final String BillingScreen$lambda$3(State<String> state) {
        return (String) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Map<MenuItem, Integer> BillingScreen$lambda$4(State<? extends Map<MenuItem, Integer>> state) {
        return (Map) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Map<MenuItem, Integer> BillingScreen$lambda$5(State<? extends Map<MenuItem, Integer>> state) {
        return (Map) state.getValue();
    }

    private static final List<TableItem> BillingScreen$lambda$6(State<? extends List<TableItem>> state) {
        return (List) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final List<Order> BillingScreen$lambda$7(State<? extends List<Order>> state) {
        return (List) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Map<String, String> BillingScreen$lambda$8(State<? extends Map<String, String>> state) {
        return (Map) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Map<String, Long> BillingScreen$lambda$9(State<? extends Map<String, Long>> state) {
        return (Map) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Map<String, Map<MenuItem, Integer>> BillingScreen$lambda$10(State<? extends Map<String, ? extends Map<MenuItem, Integer>>> state) {
        return (Map) state.getValue();
    }

    private static final CustomerHistoryResponse BillingScreen$lambda$11(State<CustomerHistoryResponse> state) {
        return (CustomerHistoryResponse) state.getValue();
    }

    private static final List<StaffUser> BillingScreen$lambda$12(State<? extends List<StaffUser>> state) {
        return (List) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final BillingFlowState BillingScreen$lambda$13(State<? extends BillingFlowState> state) {
        return (BillingFlowState) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String BillingScreen$lambda$14(State<String> state) {
        return (String) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final TableItem BillingScreen$lambda$15(State<TableItem> state) {
        return (TableItem) state.getValue();
    }

    private static final boolean BillingScreen$lambda$16(State<Boolean> state) {
        return ((Boolean) state.getValue()).booleanValue();
    }

    private static final String BillingScreen$lambda$17(State<String> state) {
        return (String) state.getValue();
    }

    private static final Boolean BillingScreen$lambda$18(State<Boolean> state) {
        return (Boolean) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Integer BillingScreen$lambda$19(State<Integer> state) {
        return (Integer) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final PosSettings BillingScreen$lambda$20(State<PosSettings> state) {
        return (PosSettings) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final List<OptionGroup> BillingScreen$lambda$21(State<? extends List<OptionGroup>> state) {
        return (List) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final int BillingScreen$lambda$22(State<Integer> state) {
        return ((Number) state.getValue()).intValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String BillingScreen$lambda$23(State<String> state) {
        return (String) state.getValue();
    }

    private static final MenuItem BillingScreen$lambda$25(MutableState<MenuItem> mutableState) {
        return (MenuItem) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$30(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$33(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String BillingScreen$lambda$36(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$39(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$42(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$45(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String BillingScreen$lambda$48(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$51(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$54(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$57(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$60(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$63(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$66(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$69(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$72(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final boolean BillingScreen$lambda$75(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final void BillingScreen$lambda$76(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String BillingScreen$lambda$78(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final boolean BillingScreen$lambda$81(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final void BillingScreen$lambda$82(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$84(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final void BillingScreen$lambda$85(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$87(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final void BillingScreen$lambda$88(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$90(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final void BillingScreen$lambda$91(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$93(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final void BillingScreen$lambda$94(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$96(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final void BillingScreen$lambda$97(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final void BillingScreen$lambda$100(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$99(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final boolean BillingScreen$lambda$102(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final void BillingScreen$lambda$103(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$105(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final void BillingScreen$lambda$106(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$108(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final void BillingScreen$lambda$109(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$111(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final void BillingScreen$lambda$112(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$114(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final void BillingScreen$lambda$115(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final String BillingScreen$lambda$117(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$120(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$123(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final boolean BillingScreen$lambda$126(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final void BillingScreen$lambda$127(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final boolean BillingScreen$lambda$130(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final void BillingScreen$lambda$131(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$137$0(BillingViewModel $billingViewModel) {
        $billingViewModel.resetOrderSuccess();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$139(long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C286@14455L62:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1849796314, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous> (BillingScreen.kt:286)");
            }
            TextKt.Text-Nvy7gAk("POS Order processed successfully!", (Modifier) null, $TextPrimary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$138(final BillingViewModel $billingViewModel, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C289@14609L40,290@14695L41,288@14567L268:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1536504737, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous> (BillingScreen.kt:288)");
            }
            ComposerKt.sourceInformationMarkerStart($composer, -887695607, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance = $composer.changedInstance($billingViewModel);
            Object rememberedValue = $composer.rememberedValue();
            if (changedInstance || rememberedValue == Composer.Companion.getEmpty()) {
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda32
                    public final Object invoke() {
                        Unit BillingScreen$lambda$138$0$0;
                        BillingScreen$lambda$138$0$0 = BillingScreenKt.BillingScreen$lambda$138$0$0($billingViewModel);
                        return BillingScreen$lambda$138$0$0;
                    }
                };
                $composer.updateRememberedValue(obj);
                rememberedValue = obj;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ButtonKt.TextButton((Function0) rememberedValue, (Modifier) null, false, (Shape) null, ButtonDefaults.INSTANCE.textButtonColors-ro_MJ88(0L, ColorKt.getSaSGreen(), 0L, 0L, $composer, ButtonDefaults.$stable << 12, 13), (ButtonElevation) null, (BorderStroke) null, (PaddingValues) null, (MutableInteractionSource) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$932245662$app(), $composer, 805306368, 494);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$138$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.resetOrderSuccess();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$0$0$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.goBack();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$0$0$1(long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C320@15842L90:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1798388617, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:320)");
            }
            IconKt.Icon-ww6aTOc(ArrowBackKt.getArrowBack(Icons.INSTANCE.getDefault()), "Back", SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(20)), $TextPrimary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$0$1$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.fetchTablesAndActiveOrders();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$0$1$1$0(BillingViewModel $billingViewModel) {
        $billingViewModel.loadCatalogAndCategories();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$0$1$2$0(BillingViewModel $billingViewModel) {
        $billingViewModel.clearCart();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$1$0$0$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.selectFlow("DINEIN");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$1$0$0$1$0(BillingViewModel $billingViewModel) {
        $billingViewModel.selectFlow("TAKEAWAY_DELIVERY");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$1$0$1$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.selectFlow("QUICK_BILL");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$1$0$1$1$0(BillingViewModel $billingViewModel) {
        $billingViewModel.selectFlow("PREORDER");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$5$0$0(List $departments, MutableState $selectedDepartment$delegate, long $InputDark, long $TextSecondary, long $CardBorderDark, LazyListScope $this$LazyRow) {
        Intrinsics.checkNotNullParameter($this$LazyRow, "$this$LazyRow");
        $this$LazyRow.items($departments.size(), (Function1) null, new BillingScreenKt$BillingScreen$lambda$140$0$5$0$0$.inlined.items.default.3(BillingScreenKt$BillingScreen$lambda$140$0$5$0$0$.inlined.items.default.1.INSTANCE, $departments), ComposableLambdaKt.composableLambdaInstance(802480018, true, new BillingScreenKt$BillingScreen$lambda$140$0$5$0$0$.inlined.items.default.4($departments, $selectedDepartment$delegate, $InputDark, $TextSecondary, $CardBorderDark)));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$5$1$0(List $filteredTables, BillingViewModel $billingViewModel, State $activeOrders$delegate, State $tableCarts$delegate, State $tableStatuses$delegate, State $tableActiveTimestamps$delegate, State $posSettings$delegate, State $selectedTable$delegate, LazyGridScope $this$LazyVerticalGrid) {
        Intrinsics.checkNotNullParameter($this$LazyVerticalGrid, "$this$LazyVerticalGrid");
        $this$LazyVerticalGrid.items($filteredTables.size(), (Function1) null, (Function2) null, new BillingScreenKt$BillingScreen$lambda$140$0$5$1$0$.inlined.items.default.4(BillingScreenKt$BillingScreen$lambda$140$0$5$1$0$.inlined.items.default.1.INSTANCE, $filteredTables), ComposableLambdaKt.composableLambdaInstance(-1117249557, true, new BillingScreenKt$BillingScreen$lambda$140$0$5$1$0$.inlined.items.default.5($filteredTables, $billingViewModel, $activeOrders$delegate, $tableCarts$delegate, $tableStatuses$delegate, $tableActiveTimestamps$delegate, $posSettings$delegate, $selectedTable$delegate)));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$0(final MutableState $activeSubTab$delegate, final long $TextSecondary, final State $cart$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C614@33976L25,615@34042L402,612@33862L612,626@34616L24,627@34681L1738,624@34503L1946,658@36595L28,659@36664L408,656@36478L624:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-310271094, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:612)");
            }
            boolean areEqual = Intrinsics.areEqual(BillingScreen$lambda$30($activeSubTab$delegate), "MENU");
            ComposerKt.sourceInformationMarkerStart($composer, -1817773277, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed = $composer.changed($activeSubTab$delegate);
            Object rememberedValue = $composer.rememberedValue();
            if (changed || rememberedValue == Composer.Companion.getEmpty()) {
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda59
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$6$0$0$0;
                        BillingScreen$lambda$140$0$6$0$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$0$0$0($activeSubTab$delegate);
                        return BillingScreen$lambda$140$0$6$0$0$0;
                    }
                };
                $composer.updateRememberedValue(obj);
                rememberedValue = obj;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.Tab-wqdebIU(areEqual, (Function0) rememberedValue, (Modifier) null, false, ComposableLambdaKt.rememberComposableLambda(1537569892, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda60
                public final Object invoke(Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$6$0$1;
                    BillingScreen$lambda$140$0$6$0$1 = BillingScreenKt.BillingScreen$lambda$140$0$6$0$1($TextSecondary, $activeSubTab$delegate, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$6$0$1;
                }
            }, $composer, 54), (Function2) null, 0L, 0L, (MutableInteractionSource) null, $composer, 24576, 492);
            boolean areEqual2 = Intrinsics.areEqual(BillingScreen$lambda$30($activeSubTab$delegate), "KOT");
            ComposerKt.sourceInformationMarkerStart($composer, -1817752798, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed2 = $composer.changed($activeSubTab$delegate);
            Object rememberedValue2 = $composer.rememberedValue();
            if (changed2 || rememberedValue2 == Composer.Companion.getEmpty()) {
                Object obj2 = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda61
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$6$0$2$0;
                        BillingScreen$lambda$140$0$6$0$2$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$0$2$0($activeSubTab$delegate);
                        return BillingScreen$lambda$140$0$6$0$2$0;
                    }
                };
                $composer.updateRememberedValue(obj2);
                rememberedValue2 = obj2;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.Tab-wqdebIU(areEqual2, (Function0) rememberedValue2, (Modifier) null, false, ComposableLambdaKt.rememberComposableLambda(-2001796403, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda62
                public final Object invoke(Object obj3, Object obj4) {
                    Unit BillingScreen$lambda$140$0$6$0$3;
                    BillingScreen$lambda$140$0$6$0$3 = BillingScreenKt.BillingScreen$lambda$140$0$6$0$3($TextSecondary, $activeSubTab$delegate, $cart$delegate, (Composer) obj3, ((Integer) obj4).intValue());
                    return BillingScreen$lambda$140$0$6$0$3;
                }
            }, $composer, 54), (Function2) null, 0L, 0L, (MutableInteractionSource) null, $composer, 24576, 492);
            boolean areEqual3 = Intrinsics.areEqual(BillingScreen$lambda$30($activeSubTab$delegate), "BILLING");
            ComposerKt.sourceInformationMarkerStart($composer, -1817689466, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed3 = $composer.changed($activeSubTab$delegate);
            Object rememberedValue3 = $composer.rememberedValue();
            if (changed3 || rememberedValue3 == Composer.Companion.getEmpty()) {
                Object obj3 = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda63
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$6$0$4$0;
                        BillingScreen$lambda$140$0$6$0$4$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$0$4$0($activeSubTab$delegate);
                        return BillingScreen$lambda$140$0$6$0$4$0;
                    }
                };
                $composer.updateRememberedValue(obj3);
                rememberedValue3 = obj3;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.Tab-wqdebIU(areEqual3, (Function0) rememberedValue3, (Modifier) null, false, ComposableLambdaKt.rememberComposableLambda(-1657233044, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda64
                public final Object invoke(Object obj4, Object obj5) {
                    Unit BillingScreen$lambda$140$0$6$0$5;
                    BillingScreen$lambda$140$0$6$0$5 = BillingScreenKt.BillingScreen$lambda$140$0$6$0$5($TextSecondary, $activeSubTab$delegate, (Composer) obj4, ((Integer) obj5).intValue());
                    return BillingScreen$lambda$140$0$6$0$5;
                }
            }, $composer, 54), (Function2) null, 0L, 0L, (MutableInteractionSource) null, $composer, 24576, 492);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$0$0$0(MutableState $activeSubTab$delegate) {
        $activeSubTab$delegate.setValue("MENU");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$0$1(long $TextSecondary, MutableState $activeSubTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C616@34080L330:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1537569892, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:616)");
            }
            FontWeight bold = FontWeight.Companion.getBold();
            TextKt.Text-Nvy7gAk("Menu", (Modifier) null, Intrinsics.areEqual(BillingScreen$lambda$30($activeSubTab$delegate), "MENU") ? ColorKt.getSaSGreen() : $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, bold, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$0$2$0(MutableState $activeSubTab$delegate) {
        $activeSubTab$delegate.setValue("KOT");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$0$3(long $TextSecondary, MutableState $activeSubTab$delegate, State $cart$delegate, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C628@34719L1666:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-2001796403, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:628)");
            }
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            Modifier modifier = Modifier.Companion;
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(Arrangement.INSTANCE.getStart(), centerVertically, $composer, ((384 >> 3) & 14) | ((384 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = ((((384 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope = RowScopeInstance.INSTANCE;
            int i3 = ((384 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -1349754700, "C629@34813L354:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk("Order/KOT", (Modifier) null, Intrinsics.areEqual(BillingScreen$lambda$30($activeSubTab$delegate), "KOT") ? ColorKt.getSaSGreen() : $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597446, 0, 262058);
            final int sumOfInt = CollectionsKt.sumOfInt(BillingScreen$lambda$4($cart$delegate).values());
            if (sumOfInt > 0) {
                $composer.startReplaceGroup(-1349283811);
                ComposerKt.sourceInformation($composer, "637@35349L28,642@35692L613,638@35422L883");
                SpacerKt.Spacer(SizeKt.width-3ABfNKs(Modifier.Companion, Dp.constructor-impl(6)), $composer, 6);
                SurfaceKt.Surface-T9BRK9s(SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(16)), RoundedCornerShapeKt.getCircleShape(), ColorKt.getSaSGreen(), 0L, 0.0f, 0.0f, (BorderStroke) null, ComposableLambdaKt.rememberComposableLambda(-1798027161, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda18
                    public final Object invoke(Object obj, Object obj2) {
                        Unit BillingScreen$lambda$140$0$6$0$3$0$0;
                        BillingScreen$lambda$140$0$6$0$3$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$0$3$0$0(sumOfInt, (Composer) obj, ((Integer) obj2).intValue());
                        return BillingScreen$lambda$140$0$6$0$3$0$0;
                    }
                }, $composer, 54), $composer, 12582918, 120);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(-1348280527);
                $composer.endReplaceGroup();
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$0$3$0$0(int $totalItems, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C643@35742L517:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1798027161, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:643)");
            }
            Alignment center = Alignment.Companion.getCenter();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            Modifier modifier = Modifier.Companion;
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = ((((48 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i3 = ((48 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 1192304910, "C644@35837L372:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk(String.valueOf($totalItems), (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(9), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597824, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$0$4$0(MutableState $activeSubTab$delegate) {
        $activeSubTab$delegate.setValue("BILLING");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$0$5(long $TextSecondary, MutableState $activeSubTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C660@36702L336:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1657233044, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:660)");
            }
            FontWeight bold = FontWeight.Companion.getBold();
            TextKt.Text-Nvy7gAk("Billing", (Modifier) null, Intrinsics.areEqual(BillingScreen$lambda$30($activeSubTab$delegate), "BILLING") ? ColorKt.getSaSGreen() : $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, bold, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$0$0$0(BillingViewModel $billingViewModel, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $billingViewModel.setSearchQuery(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @Composable
    @ComposableInferredTarget(scheme = "[androidx.compose.ui.UiComposable[androidx.compose.ui.UiComposable]]")
    public static final Unit BillingScreen$lambda$140$0$6$1$0$1(long $TextSecondary, State $searchQuery$delegate, Function2 innerTextField, Composer $composer, int $changed) {
        Function0 function0;
        Function0 function02;
        Intrinsics.checkNotNullParameter(innerTextField, "innerTextField");
        ComposerKt.sourceInformation($composer, "CN(innerTextField)698@39078L1790:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            $dirty |= $composer.changedInstance(innerTextField) ? 4 : 2;
        }
        if ($composer.shouldExecute(($dirty & 19) != 18, $dirty & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-555821901, $dirty, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:698)");
            }
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            Modifier fillMaxSize$default = SizeKt.fillMaxSize$default(Modifier.Companion, 0.0f, 1, (Object) null);
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(Arrangement.INSTANCE.getStart(), centerVertically, $composer, ((390 >> 3) & 14) | ((390 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            int $dirty2 = $dirty;
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, fillMaxSize$default);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = ((((390 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            int i3 = ((390 >> 6) & 112) | 6;
            RowScope rowScope = RowScopeInstance.INSTANCE;
            ComposerKt.sourceInformationMarkerStart($composer, -886259953, "C702@39373L400,708@39826L39,709@39918L900:BillingScreen.kt#7ez3px");
            IconKt.Icon-ww6aTOc(SearchKt.getSearch(Icons.INSTANCE.getDefault()), (String) null, SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(18)), $TextSecondary, $composer, 432, 0);
            SpacerKt.Spacer(SizeKt.width-3ABfNKs(Modifier.Companion, Dp.constructor-impl(8)), $composer, 6);
            Modifier weight$default = RowScope.weight$default(rowScope, Modifier.Companion, 1.0f, false, 2, (Object) null);
            Alignment centerStart = Alignment.Companion.getCenterStart();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(centerStart, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap2 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer, weight$default);
            Function0 constructor2 = ComposeUiNode.Companion.getConstructor();
            int i4 = ((((48 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function02 = constructor2;
                $composer.createNode(function02);
            } else {
                function02 = constructor2;
                $composer.useNode();
            }
            Composer composer2 = Updater.constructor-impl($composer);
            Updater.set-impl(composer2, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer2, currentCompositionLocalMap2, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer2, Integer.valueOf(hashCode2), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer2, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer2, materializeModifier2, ComposeUiNode.Companion.getSetModifier());
            int i5 = (i4 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i6 = ((48 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -2145544710, "C720@40748L16:BillingScreen.kt#7ez3px");
            if (BillingScreen$lambda$3($searchQuery$delegate).length() == 0) {
                $composer.startReplaceGroup(-2145521027);
                ComposerKt.sourceInformation($composer, "714@40309L324");
                TextKt.Text-Nvy7gAk("Search menu...", (Modifier) null, $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 24582, 0, 262122);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(-2145094343);
                $composer.endReplaceGroup();
            }
            innerTextField.invoke($composer, Integer.valueOf($dirty2 & 14));
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$0$2$1$0(boolean $isVeg, MutableState $foodTypeFilter$delegate) {
        $foodTypeFilter$delegate.setValue($isVeg ? "NON-VEG" : "VEG");
        return Unit.INSTANCE;
    }

    private static final long BillingScreen$lambda$140$0$6$1$0$2$2(State<Color> state) {
        return ((Color) state.getValue()).unbox-impl();
    }

    private static final float BillingScreen$lambda$140$0$6$1$0$2$3(State<Dp> state) {
        return ((Dp) state.getValue()).unbox-impl();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$0$2$5$0(boolean $isVeg, MutableState $foodTypeFilter$delegate) {
        $foodTypeFilter$delegate.setValue($isVeg ? "NON-VEG" : "VEG");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$2$0$0$0(BillingViewModel $billingViewModel, int $tier) {
        $billingViewModel.setPriceTier($tier);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$1$0$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.loadCatalogAndCategories();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$3$0(List $sortedItems, BillingViewModel $billingViewModel, State $optionGroups$delegate, State $cart$delegate, State $oldKotItems$delegate, State $selectedPriceTier$delegate, State $currentOrderType$delegate, MutableState $selectedItemForModifiers$delegate, State $posSettings$delegate, LazyGridScope $this$LazyVerticalGrid) {
        Intrinsics.checkNotNullParameter($this$LazyVerticalGrid, "$this$LazyVerticalGrid");
        $this$LazyVerticalGrid.items($sortedItems.size(), new BillingScreenKt$BillingScreen$lambda$140$0$6$1$3$3$0$.inlined.items.default.2(new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda70
            public final Object invoke(Object obj) {
                Object BillingScreen$lambda$140$0$6$1$3$3$0$0;
                BillingScreen$lambda$140$0$6$1$3$3$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$1$3$3$0$0((MenuItem) obj);
                return BillingScreen$lambda$140$0$6$1$3$3$0$0;
            }
        }, $sortedItems), (Function2) null, new BillingScreenKt$BillingScreen$lambda$140$0$6$1$3$3$0$.inlined.items.default.4(BillingScreenKt$BillingScreen$lambda$140$0$6$1$3$3$0$.inlined.items.default.1.INSTANCE, $sortedItems), ComposableLambdaKt.composableLambdaInstance(-1117249557, true, new BillingScreenKt$BillingScreen$lambda$140$0$6$1$3$3$0$.inlined.items.default.5($sortedItems, $billingViewModel, $optionGroups$delegate, $cart$delegate, $oldKotItems$delegate, $selectedPriceTier$delegate, $currentOrderType$delegate, $selectedItemForModifiers$delegate, $posSettings$delegate)));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Object BillingScreen$lambda$140$0$6$1$3$3$0$0(MenuItem it) {
        Intrinsics.checkNotNullParameter(it, "it");
        return Integer.valueOf(it.getId());
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$0$0$0(MutableState $showCategoryMenu$delegate) {
        BillingScreen$lambda$115($showCategoryMenu$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$0$1(State $selectedCategory$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C912@54804L534:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1421338564, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:912)");
            }
            String upperCase = BillingScreen$lambda$2($selectedCategory$delegate).toUpperCase(Locale.ROOT);
            Intrinsics.checkNotNullExpressionValue(upperCase, "toUpperCase(...)");
            TextKt.Text-Nvy7gAk(upperCase, PaddingKt.padding-VpY3zN4(Modifier.Companion, Dp.constructor-impl(12), Dp.constructor-impl(6)), Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597872, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$0$2$0(MutableState $showCategoryMenu$delegate) {
        BillingScreen$lambda$115($showCategoryMenu$delegate, !BillingScreen$lambda$114($showCategoryMenu$delegate));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$0$3(MutableState $showCategoryMenu$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C929@56038L375:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1312497040, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:929)");
            }
            IconKt.Icon-ww6aTOc(BillingScreen$lambda$114($showCategoryMenu$delegate) ? CloseKt.getClose(Icons.INSTANCE.getDefault()) : ListKt.getList(Icons.INSTANCE.getDefault()), "Categories", SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(24)), 0L, $composer, 432, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$1$0(MutableState $showCategoryMenu$delegate) {
        BillingScreen$lambda$115($showCategoryMenu$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$2(final BillingViewModel $billingViewModel, long $CardBorderDark, final long $TextSecondary, final long $TextPrimary, final State $selectedCategory$delegate, final MutableState $showCategoryMenu$delegate, State $categories$delegate, ColumnScope $this$DropdownMenu, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter($this$DropdownMenu, "$this$DropdownMenu");
        ComposerKt.sourceInformation($composer, "C947@57307L1361,964@58732L228,946@57230L2057,972@59336L89,*977@59799L1455,994@61322L243,976@59718L2175:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1817040035, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:946)");
            }
            Function2 rememberComposableLambda = ComposableLambdaKt.rememberComposableLambda(-2133946253, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda106
                public final Object invoke(Object obj, Object obj2) {
                    Unit BillingScreen$lambda$140$0$6$1$3$4$2$0;
                    BillingScreen$lambda$140$0$6$1$3$4$2$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$1$3$4$2$0($TextSecondary, $TextPrimary, $selectedCategory$delegate, (Composer) obj, ((Integer) obj2).intValue());
                    return BillingScreen$lambda$140$0$6$1$3$4$2$0;
                }
            }, $composer, 54);
            ComposerKt.sourceInformationMarkerStart($composer, -1876163961, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance = $composer.changedInstance($billingViewModel);
            Object rememberedValue = $composer.rememberedValue();
            if (changedInstance || rememberedValue == Composer.Companion.getEmpty()) {
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda107
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$6$1$3$4$2$1$0;
                        BillingScreen$lambda$140$0$6$1$3$4$2$1$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$1$3$4$2$1$0($billingViewModel, $showCategoryMenu$delegate);
                        return BillingScreen$lambda$140$0$6$1$3$4$2$1$0;
                    }
                };
                $composer.updateRememberedValue(obj);
                rememberedValue = obj;
            }
            Function0 function0 = (Function0) rememberedValue;
            ComposerKt.sourceInformationMarkerEnd($composer);
            AndroidMenu_androidKt.DropdownMenuItem(rememberComposableLambda, function0, BackgroundKt.background-bw27NRU$default(Modifier.Companion, Intrinsics.areEqual(BillingScreen$lambda$2($selectedCategory$delegate), "ALL") ? Color.copy-wmQWz5c$default(ColorKt.getSaSGreen(), 0.1f, 0.0f, 0.0f, 0.0f, 14, (Object) null) : Color.Companion.getTransparent-0d7_KjU(), (Shape) null, 2, (Object) null), (Function2) null, (Function2) null, false, (MenuItemColors) null, (PaddingValues) null, (MutableInteractionSource) null, $composer, 6, 504);
            DividerKt.HorizontalDivider-9IZ8Weo(PaddingKt.padding-VpY3zN4$default(Modifier.Companion, Dp.constructor-impl(8), 0.0f, 2, (Object) null), 0.0f, $CardBorderDark, $composer, 6, 2);
            Composer composer = $composer;
            for (final CategoryItem categoryItem : BillingScreen$lambda$1($categories$delegate)) {
                final boolean areEqual = Intrinsics.areEqual(BillingScreen$lambda$2($selectedCategory$delegate), categoryItem.getName());
                Function2 rememberComposableLambda2 = ComposableLambdaKt.rememberComposableLambda(-1755890685, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda108
                    public final Object invoke(Object obj2, Object obj3) {
                        Unit BillingScreen$lambda$140$0$6$1$3$4$2$2$0;
                        BillingScreen$lambda$140$0$6$1$3$4$2$2$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$1$3$4$2$2$0(areEqual, $TextSecondary, categoryItem, $TextPrimary, (Composer) obj2, ((Integer) obj3).intValue());
                        return BillingScreen$lambda$140$0$6$1$3$4$2$2$0;
                    }
                }, composer, 54);
                ComposerKt.sourceInformationMarkerStart(composer, -1739789722, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changedInstance2 = composer.changedInstance($billingViewModel) | composer.changed(categoryItem);
                Object rememberedValue2 = $composer.rememberedValue();
                if (changedInstance2 || rememberedValue2 == Composer.Companion.getEmpty()) {
                    Object obj2 = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda109
                        public final Object invoke() {
                            Unit BillingScreen$lambda$140$0$6$1$3$4$2$2$1$0;
                            BillingScreen$lambda$140$0$6$1$3$4$2$2$1$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$1$3$4$2$2$1$0($billingViewModel, categoryItem, $showCategoryMenu$delegate);
                            return BillingScreen$lambda$140$0$6$1$3$4$2$2$1$0;
                        }
                    };
                    $composer.updateRememberedValue(obj2);
                    rememberedValue2 = obj2;
                }
                Function0 function02 = (Function0) rememberedValue2;
                ComposerKt.sourceInformationMarkerEnd(composer);
                AndroidMenu_androidKt.DropdownMenuItem(rememberComposableLambda2, function02, BackgroundKt.background-bw27NRU$default(Modifier.Companion, areEqual ? Color.copy-wmQWz5c$default(ColorKt.getSaSGreen(), 0.1f, 0.0f, 0.0f, 0.0f, 14, (Object) null) : Color.Companion.getTransparent-0d7_KjU(), (Shape) null, 2, (Object) null), (Function2) null, (Function2) null, false, (MenuItemColors) null, (PaddingValues) null, (MutableInteractionSource) null, $composer, 6, 504);
                composer = $composer;
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$2$0(long $TextSecondary, long $TextPrimary, State $selectedCategory$delegate, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C948@57365L1249:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-2133946253, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:948)");
            }
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            Modifier modifier = Modifier.Companion;
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(Arrangement.INSTANCE.getStart(), centerVertically, $composer, ((384 >> 3) & 14) | ((384 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = ((((384 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope = RowScopeInstance.INSTANCE;
            int i3 = ((384 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -1340185481, "C949@57479L483,955@58023L29,956@58113L443:BillingScreen.kt#7ez3px");
            IconKt.Icon-ww6aTOc(AppsKt.getApps(Icons.INSTANCE.getDefault()), (String) null, SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(18)), Intrinsics.areEqual(BillingScreen$lambda$2($selectedCategory$delegate), "ALL") ? ColorKt.getSaSGreen() : $TextSecondary, $composer, 432, 0);
            SpacerKt.Spacer(SizeKt.width-3ABfNKs(Modifier.Companion, Dp.constructor-impl(12)), $composer, 6);
            TextKt.Text-Nvy7gAk("ALL", (Modifier) null, Intrinsics.areEqual(BillingScreen$lambda$2($selectedCategory$delegate), "ALL") ? ColorKt.getSaSGreen() : $TextPrimary, (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597446, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$2$1$0(BillingViewModel $billingViewModel, MutableState $showCategoryMenu$delegate) {
        $billingViewModel.setCategory("ALL");
        BillingScreen$lambda$115($showCategoryMenu$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$2$2$0(boolean $isSelected, long $TextSecondary, CategoryItem $cat, long $TextPrimary, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C978@59861L1335:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1755890685, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:978)");
            }
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            Modifier modifier = Modifier.Companion;
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(Arrangement.INSTANCE.getStart(), centerVertically, $composer, ((384 >> 3) & 14) | ((384 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = ((((384 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope = RowScopeInstance.INSTANCE;
            int i3 = ((384 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 1449241377, "C979@59979L494,985@60538L29,986@60632L502:BillingScreen.kt#7ez3px");
            IconKt.Icon-ww6aTOc(RestaurantKt.getRestaurant(Icons.INSTANCE.getDefault()), (String) null, SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(18)), $isSelected ? ColorKt.getSaSGreen() : $TextSecondary, $composer, 432, 0);
            SpacerKt.Spacer(SizeKt.width-3ABfNKs(Modifier.Companion, Dp.constructor-impl(12)), $composer, 6);
            String upperCase = $cat.getName().toUpperCase(Locale.ROOT);
            Intrinsics.checkNotNullExpressionValue(upperCase, "toUpperCase(...)");
            FontWeight.Companion companion = FontWeight.Companion;
            TextKt.Text-Nvy7gAk(upperCase, (Modifier) null, $isSelected ? ColorKt.getSaSGreen() : $TextPrimary, (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, $isSelected ? companion.getBold() : companion.getMedium(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 24576, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$2$2$1$0(BillingViewModel $billingViewModel, CategoryItem $cat, MutableState $showCategoryMenu$delegate) {
        $billingViewModel.setCategory($cat.getName());
        BillingScreen$lambda$115($showCategoryMenu$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$5$0(MutableState $activeSubTab$delegate) {
        $activeSubTab$delegate.setValue("KOT");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$1$6(final MutableState $activeSubTab$delegate, int $totalItems, long $TextSecondary, double $totalPrice, State $posSettings$delegate, ColumnScope $this$Card, Composer $composer, int $changed) {
        Function0 function0;
        Function0 function02;
        Function0 function03;
        Function0 function04;
        Intrinsics.checkNotNullParameter($this$Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C1022@63194L3162:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1156069808, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1022)");
            }
            Modifier modifier = PaddingKt.padding-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(14));
            Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, centerVertically, $composer, ((438 >> 3) & 14) | ((438 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = ((((438 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope = RowScopeInstance.INSTANCE;
            int i3 = ((438 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -594410146, "C1029@63693L1671,1052@65585L39,1051@65483L24,1050@65413L897:BillingScreen.kt#7ez3px");
            Alignment.Vertical centerVertically2 = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            Modifier modifier2 = Modifier.Companion;
            MeasurePolicy rowMeasurePolicy2 = RowKt.rowMeasurePolicy(Arrangement.INSTANCE.getStart(), centerVertically2, $composer, ((384 >> 3) & 14) | ((384 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap2 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer, modifier2);
            Function0 constructor2 = ComposeUiNode.Companion.getConstructor();
            int i4 = ((((384 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function02 = constructor2;
                $composer.createNode(function02);
            } else {
                function02 = constructor2;
                $composer.useNode();
            }
            Composer composer2 = Updater.constructor-impl($composer);
            Updater.set-impl(composer2, rowMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer2, currentCompositionLocalMap2, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer2, Integer.valueOf(hashCode2), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer2, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer2, materializeModifier2, ComposeUiNode.Companion.getSetModifier());
            int i5 = (i4 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope2 = RowScopeInstance.INSTANCE;
            int i6 = ((384 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 20111056, "C1030@63799L682,1039@64534L40,1040@64627L687:BillingScreen.kt#7ez3px");
            Modifier modifier3 = BackgroundKt.background-bw27NRU$default(ClipKt.clip(SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(36)), RoundedCornerShapeKt.getCircleShape()), Color.copy-wmQWz5c$default(ColorKt.getSaSGreen(), 0.15f, 0.0f, 0.0f, 0.0f, 14, (Object) null), (Shape) null, 2, (Object) null);
            Alignment center = Alignment.Companion.getCenter();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap3 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier3 = ComposedModifierKt.materializeModifier($composer, modifier3);
            Function0 constructor3 = ComposeUiNode.Companion.getConstructor();
            int i7 = ((((48 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function03 = constructor3;
                $composer.createNode(function03);
            } else {
                function03 = constructor3;
                $composer.useNode();
            }
            Composer composer3 = Updater.constructor-impl($composer);
            Updater.set-impl(composer3, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer3, currentCompositionLocalMap3, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer3, Integer.valueOf(hashCode3), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer3, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer3, materializeModifier3, ComposeUiNode.Companion.getSetModifier());
            int i8 = (i7 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i9 = ((48 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -1104227703, "C1037@64339L88:BillingScreen.kt#7ez3px");
            IconKt.Icon-ww6aTOc(ShoppingCartKt.getShoppingCart(Icons.INSTANCE.getDefault()), (String) null, SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(18)), ColorKt.getSaSGreen(), $composer, 432, 0);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            SpacerKt.Spacer(SizeKt.width-3ABfNKs(Modifier.Companion, Dp.constructor-impl(12)), $composer, 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            Modifier modifier4 = Modifier.Companion;
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), $composer, ((0 >> 3) & 14) | ((0 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode4 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap4 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier4 = ComposedModifierKt.materializeModifier($composer, modifier4);
            Function0 constructor4 = ComposeUiNode.Companion.getConstructor();
            int i10 = ((((0 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function04 = constructor4;
                $composer.createNode(function04);
            } else {
                function04 = constructor4;
                $composer.useNode();
            }
            Composer composer4 = Updater.constructor-impl($composer);
            Updater.set-impl(composer4, columnMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer4, currentCompositionLocalMap4, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer4, Integer.valueOf(hashCode4), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer4, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer4, materializeModifier4, ComposeUiNode.Companion.getSetModifier());
            int i11 = (i10 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope = ColumnScopeInstance.INSTANCE;
            int i12 = ((0 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -1546503911, "C1041@64692L75,1042@64824L436:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk($totalItems + " items selected", (Modifier) null, $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 24576, 0, 262122);
            TextKt.Text-Nvy7gAk(BillingScreen$lambda$20($posSettings$delegate).getCurrency() + " " + formatPrice($totalPrice, BillingScreen$lambda$20($posSettings$delegate)), (Modifier) null, ColorKt.getSaSGreen(), (TextAutoSize) null, TextUnitKt.getSp(16), (FontStyle) null, FontWeight.Companion.getBlack(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597440, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ButtonColors buttonColors = ButtonDefaults.INSTANCE.buttonColors-ro_MJ88(ColorKt.getSaSGreen(), 0L, 0L, 0L, $composer, ButtonDefaults.$stable << 12, 14);
            Shape shape = RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(16));
            PaddingValues paddingValues = PaddingKt.PaddingValues-YgX7TsA(Dp.constructor-impl(14), Dp.constructor-impl(6));
            ComposerKt.sourceInformationMarkerStart($composer, 2059090148, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed = $composer.changed($activeSubTab$delegate);
            Object rememberedValue = $composer.rememberedValue();
            if (changed || rememberedValue == Composer.Companion.getEmpty()) {
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda25
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$6$1$6$0$1$0;
                        BillingScreen$lambda$140$0$6$1$6$0$1$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$1$6$0$1$0($activeSubTab$delegate);
                        return BillingScreen$lambda$140$0$6$1$6$0$1$0;
                    }
                };
                $composer.updateRememberedValue(obj);
                rememberedValue = obj;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ButtonKt.Button((Function0) rememberedValue, (Modifier) null, false, shape, buttonColors, (ButtonElevation) null, (BorderStroke) null, paddingValues, (MutableInteractionSource) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$-563310628$app(), $composer, 817889280, 358);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$6$0$1$0(MutableState $activeSubTab$delegate) {
        $activeSubTab$delegate.setValue("KOT");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$1$0$0(Context $context) {
        Toast.makeText($context, "Remote KOT triggered", 0).show();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$3$1$0(State $cart$delegate, long $CardDark, long $CardBorderDark, long $TextPrimary, long $TextSecondary, State $posSettings$delegate, long $InputDark, BillingViewModel $billingViewModel, LazyListScope $this$LazyColumn) {
        Intrinsics.checkNotNullParameter($this$LazyColumn, "$this$LazyColumn");
        List list = CollectionsKt.toList(BillingScreen$lambda$4($cart$delegate).entrySet());
        $this$LazyColumn.items(list.size(), new BillingScreenKt$BillingScreen$lambda$140$0$6$2$3$1$0$.inlined.items.default.2(new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda36
            public final Object invoke(Object obj) {
                Object BillingScreen$lambda$140$0$6$2$3$1$0$0;
                BillingScreen$lambda$140$0$6$2$3$1$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$2$3$1$0$0((Map.Entry) obj);
                return BillingScreen$lambda$140$0$6$2$3$1$0$0;
            }
        }, list), new BillingScreenKt$BillingScreen$lambda$140$0$6$2$3$1$0$.inlined.items.default.3(BillingScreenKt$BillingScreen$lambda$140$0$6$2$3$1$0$.inlined.items.default.1.INSTANCE, list), ComposableLambdaKt.composableLambdaInstance(802480018, true, new BillingScreenKt$BillingScreen$lambda$140$0$6$2$3$1$0$.inlined.items.default.4(list, $CardDark, $CardBorderDark, $TextPrimary, $TextSecondary, $posSettings$delegate, $InputDark, $billingViewModel)));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Object BillingScreen$lambda$140$0$6$2$3$1$0$0(Map.Entry it) {
        Intrinsics.checkNotNullParameter(it, "it");
        int id = ((MenuItem) it.getKey()).getId();
        double price = ((MenuItem) it.getKey()).getPrice();
        List selectedModifiers = ((MenuItem) it.getKey()).getSelectedModifiers();
        int hashCode = selectedModifiers != null ? selectedModifiers.hashCode() : 0;
        String kitchenNote = ((MenuItem) it.getKey()).getKitchenNote();
        int hashCode2 = kitchenNote != null ? kitchenNote.hashCode() : 0;
        String priceLabel = ((MenuItem) it.getKey()).getPriceLabel();
        if (priceLabel == null) {
            priceLabel = "";
        }
        return id + "_" + price + "_" + hashCode + "_" + hashCode2 + "_" + priceLabel;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$4$0$0(Context $context, MutableState $isComplimentaryOrder$delegate) {
        BillingScreen$lambda$82($isComplimentaryOrder$delegate, !BillingScreen$lambda$81($isComplimentaryOrder$delegate));
        Toast.makeText($context, BillingScreen$lambda$81($isComplimentaryOrder$delegate) ? "Complimentary mode enabled" : "Complimentary mode disabled", 0).show();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$2$4$1(long $TextSecondary, MutableState $isComplimentaryOrder$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1271@83336L411:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1574583601, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1271)");
            }
            IconKt.Icon-ww6aTOc(RedeemKt.getRedeem(Icons.INSTANCE.getDefault()), "Complimentary", SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(20)), BillingScreen$lambda$81($isComplimentaryOrder$delegate) ? ColorKt.getSaSGreen() : $TextSecondary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$4$2$0(Context $context) {
        Toast.makeText($context, "Offers/Coupons opened", 0).show();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$2$4$3(long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1285@84303L372:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1640391258, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1285)");
            }
            IconKt.Icon-ww6aTOc(BookmarkBorderKt.getBookmarkBorder(Icons.INSTANCE.getDefault()), "Offers", SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(20)), $TextSecondary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$4$4$0(MutableState $showNoteDialog$delegate) {
        BillingScreen$lambda$103($showNoteDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$2$4$5(long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1294@84955L115:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-291566023, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1294)");
            }
            IconKt.Icon-ww6aTOc(NoteAddKt.getNoteAdd(Icons.INSTANCE.getDefault()), "Add Note", SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(20)), $TextSecondary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$0$0$0(MutableState $showCountryDropdown$delegate) {
        BillingScreen$lambda$127($showCountryDropdown$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$0$2$0(MutableState $showCountryDropdown$delegate) {
        BillingScreen$lambda$127($showCountryDropdown$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$2$5$0$3(final MutableState $selectedCountryCode$delegate, final MutableState $selectedCountryFlag$delegate, final MutableState $selectedDialCode$delegate, final long $TextPrimary, final MutableState $showCountryDropdown$delegate, ColumnScope $this$DropdownMenu, Composer $composer, int $changed) {
        Modifier modifier;
        Composer composer = $composer;
        Intrinsics.checkNotNullParameter($this$DropdownMenu, "$this$DropdownMenu");
        ComposerKt.sourceInformation(composer, "C*1334@88059L675,1343@88802L433,1333@87978L1527:BillingScreen.kt#7ez3px");
        boolean z = true;
        if (!composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1466467357, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1332)");
            }
            for (final CountryCodeItem countryCodeItem : countryCodes) {
                PaddingValues paddingValues = PaddingKt.PaddingValues-YgX7TsA(Dp.constructor-impl(10), Dp.constructor-impl(2));
                Modifier modifier2 = SizeKt.height-3ABfNKs(Modifier.Companion, Dp.constructor-impl(36));
                Function2 rememberComposableLambda = ComposableLambdaKt.rememberComposableLambda(607386034, z, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda34
                    public final Object invoke(Object obj, Object obj2) {
                        Unit BillingScreen$lambda$140$0$6$2$5$0$3$0$0;
                        BillingScreen$lambda$140$0$6$2$5$0$3$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$2$5$0$3$0$0(countryCodeItem, $TextPrimary, (Composer) obj, ((Integer) obj2).intValue());
                        return BillingScreen$lambda$140$0$6$2$5$0$3$0$0;
                    }
                }, composer, 54);
                ComposerKt.sourceInformationMarkerStart(composer, -127543757, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changed = composer.changed($selectedCountryCode$delegate) | composer.changed(countryCodeItem) | composer.changed($selectedCountryFlag$delegate) | composer.changed($selectedDialCode$delegate);
                Object rememberedValue = $composer.rememberedValue();
                if (changed || rememberedValue == Composer.Companion.getEmpty()) {
                    modifier = modifier2;
                    rememberedValue = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda35
                        public final Object invoke() {
                            Unit BillingScreen$lambda$140$0$6$2$5$0$3$0$1$0;
                            BillingScreen$lambda$140$0$6$2$5$0$3$0$1$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$2$5$0$3$0$1$0(countryCodeItem, $selectedCountryCode$delegate, $selectedCountryFlag$delegate, $selectedDialCode$delegate, $showCountryDropdown$delegate);
                            return BillingScreen$lambda$140$0$6$2$5$0$3$0$1$0;
                        }
                    };
                    $composer.updateRememberedValue(rememberedValue);
                } else {
                    modifier = modifier2;
                }
                ComposerKt.sourceInformationMarkerEnd(composer);
                AndroidMenu_androidKt.DropdownMenuItem(rememberComposableLambda, (Function0) rememberedValue, modifier, (Function2) null, (Function2) null, false, (MenuItemColors) null, paddingValues, (MutableInteractionSource) null, composer, 12583302, 376);
                composer = $composer;
                z = true;
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$2$5$0$3$0$0(CountryCodeItem $country, long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1335@88121L555:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(607386034, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1335)");
            }
            TextKt.Text-Nvy7gAk($country.getFlag() + " " + $country.getCode() + " (" + $country.getDialCode() + ") - " + $country.getName(), (Modifier) null, $TextPrimary, (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, TextOverflow.Companion.getEllipsis-gIe3tQ8(), false, 1, 0, (Function1) null, (TextStyle) null, $composer, 24576, 24960, 241642);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$0$3$0$1$0(CountryCodeItem $country, MutableState $selectedCountryCode$delegate, MutableState $selectedCountryFlag$delegate, MutableState $selectedDialCode$delegate, MutableState $showCountryDropdown$delegate) {
        $selectedCountryCode$delegate.setValue($country.getCode());
        $selectedCountryFlag$delegate.setValue($country.getFlag());
        $selectedDialCode$delegate.setValue($country.getDialCode());
        BillingScreen$lambda$127($showCountryDropdown$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$1$0$0(BillingViewModel $billingViewModel, MutableState $customerPhone$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $customerPhone$delegate.setValue(it);
        $billingViewModel.searchCustomers(it);
        return Unit.INSTANCE;
    }

    private static final List<SearchedCustomer> BillingScreen$lambda$140$0$6$2$5$1$1(State<? extends List<SearchedCustomer>> state) {
        return (List) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$1$2$0(BillingViewModel $billingViewModel) {
        $billingViewModel.clearSearchResults();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$2$5$1$3(State $searchResults$delegate, final MutableState $selectedCountryCode$delegate, final MutableState $selectedCountryFlag$delegate, final MutableState $selectedDialCode$delegate, final MutableState $customerPhone$delegate, final MutableState $customerName$delegate, final MutableState $customerAddress$delegate, final BillingViewModel $billingViewModel, final long $TextPrimary, final long $TextSecondary, ColumnScope $this$DropdownMenu, Composer $composer, int $changed) {
        Composer composer;
        Composer composer2 = $composer;
        Intrinsics.checkNotNullParameter($this$DropdownMenu, "$this$DropdownMenu");
        ComposerKt.sourceInformation(composer2, "C*1381@91646L1753,1403@93467L1119,1380@91565L3075:BillingScreen.kt#7ez3px");
        boolean z = true;
        if (!composer2.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1249425484, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1379)");
            }
            for (final SearchedCustomer searchedCustomer : BillingScreen$lambda$140$0$6$2$5$1$1($searchResults$delegate)) {
                Function2 rememberComposableLambda = ComposableLambdaKt.rememberComposableLambda(300936512, z, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda241
                    public final Object invoke(Object obj, Object obj2) {
                        Unit BillingScreen$lambda$140$0$6$2$5$1$3$0$0;
                        BillingScreen$lambda$140$0$6$2$5$1$3$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$2$5$1$3$0$0(searchedCustomer, $TextPrimary, $TextSecondary, (Composer) obj, ((Integer) obj2).intValue());
                        return BillingScreen$lambda$140$0$6$2$5$1$3$0$0;
                    }
                }, composer2, 54);
                ComposerKt.sourceInformationMarkerStart(composer2, -618833553, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changedInstance = composer2.changedInstance($billingViewModel) | composer2.changed(searchedCustomer) | composer2.changed($selectedCountryCode$delegate) | composer2.changed($selectedCountryFlag$delegate) | composer2.changed($selectedDialCode$delegate) | composer2.changed($customerPhone$delegate) | composer2.changed($customerName$delegate) | composer2.changed($customerAddress$delegate);
                Object rememberedValue = $composer.rememberedValue();
                if (changedInstance) {
                    composer = $composer;
                } else {
                    composer = $composer;
                    if (rememberedValue != Composer.Companion.getEmpty()) {
                        ComposerKt.sourceInformationMarkerEnd($composer);
                        composer2 = $composer;
                        AndroidMenu_androidKt.DropdownMenuItem(rememberComposableLambda, (Function0) rememberedValue, (Modifier) null, (Function2) null, (Function2) null, false, (MenuItemColors) null, (PaddingValues) null, (MutableInteractionSource) null, composer2, 6, 508);
                        z = true;
                    }
                }
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda242
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$6$2$5$1$3$0$1$0;
                        BillingScreen$lambda$140$0$6$2$5$1$3$0$1$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$2$5$1$3$0$1$0(searchedCustomer, $billingViewModel, $selectedCountryCode$delegate, $selectedCountryFlag$delegate, $selectedDialCode$delegate, $customerPhone$delegate, $customerName$delegate, $customerAddress$delegate);
                        return BillingScreen$lambda$140$0$6$2$5$1$3$0$1$0;
                    }
                };
                composer.updateRememberedValue(obj);
                rememberedValue = obj;
                ComposerKt.sourceInformationMarkerEnd($composer);
                composer2 = $composer;
                AndroidMenu_androidKt.DropdownMenuItem(rememberComposableLambda, (Function0) rememberedValue, (Modifier) null, (Function2) null, (Function2) null, false, (MenuItemColors) null, (PaddingValues) null, (MutableInteractionSource) null, composer2, 6, 508);
                z = true;
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$2$5$1$3$0$0(SearchedCustomer $customer, long $TextPrimary, long $TextSecondary, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C1382@91708L1633:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(300936512, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1382)");
            }
            Modifier modifier = PaddingKt.padding-VpY3zN4$default(Modifier.Companion, 0.0f, Dp.constructor-impl(4), 1, (Object) null);
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), $composer, ((6 >> 3) & 14) | ((6 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = ((((6 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, columnMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope = ColumnScopeInstance.INSTANCE;
            int i3 = ((6 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 713271629, "C1383@91827L447,1389@92339L345:BillingScreen.kt#7ez3px");
            String name = $customer.getName();
            if (name == null) {
                name = "Customer";
            }
            TextKt.Text-Nvy7gAk(name, (Modifier) null, $TextPrimary, (TextAutoSize) null, TextUnitKt.getSp(12), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597440, 0, 262058);
            String number = $customer.getNumber();
            if (number == null) {
                number = "";
            }
            TextKt.Text-Nvy7gAk(number, (Modifier) null, $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 24576, 0, 262122);
            String address = $customer.getAddress();
            if (!(address == null || StringsKt.isBlank(address))) {
                $composer.startReplaceGroup(714195149);
                ComposerKt.sourceInformation($composer, "1395@92858L355");
                TextKt.Text-Nvy7gAk($customer.getAddress(), (Modifier) null, $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(9), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 24576, 0, 262122);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(714667000);
                $composer.endReplaceGroup();
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$1$3$0$1$0(SearchedCustomer $customer, BillingViewModel $billingViewModel, MutableState $selectedCountryCode$delegate, MutableState $selectedCountryFlag$delegate, MutableState $selectedDialCode$delegate, MutableState $customerPhone$delegate, MutableState $customerName$delegate, MutableState $customerAddress$delegate) {
        Object obj;
        String str;
        String fullPhone = $customer.getNumber();
        if (fullPhone == null) {
            fullPhone = "";
        }
        Triple parsed = parsePhoneNumber(fullPhone);
        $selectedCountryCode$delegate.setValue((String) parsed.getFirst());
        $selectedCountryFlag$delegate.setValue((String) parsed.getSecond());
        Iterator<T> it = countryCodes.iterator();
        while (true) {
            if (!it.hasNext()) {
                obj = null;
                break;
            }
            obj = it.next();
            if (Intrinsics.areEqual(((CountryCodeItem) obj).getCode(), parsed.getFirst())) {
                break;
            }
        }
        CountryCodeItem country = (CountryCodeItem) obj;
        if (country == null || (str = country.getDialCode()) == null) {
            str = "+91";
        }
        $selectedDialCode$delegate.setValue(str);
        $customerPhone$delegate.setValue((String) parsed.getThird());
        String name = $customer.getName();
        if (name == null) {
            name = "";
        }
        $customerName$delegate.setValue(name);
        String address = $customer.getAddress();
        $customerAddress$delegate.setValue(address != null ? address : "");
        $billingViewModel.clearSearchResults();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$2$0(MutableState $customerName$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $customerName$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$3$0(BillingViewModel $billingViewModel, Context $context, MutableState $customerPhone$delegate, MutableState $showHistoryDialog$delegate) {
        if (!StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate))) {
            $billingViewModel.fetchCustomerHistory(BillingScreen$lambda$42($customerPhone$delegate));
            BillingScreen$lambda$94($showHistoryDialog$delegate, true);
        } else {
            Toast.makeText($context, "Please enter customer mobile first", 0).show();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$2$5$4(long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1441@96124L114:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(181650192, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1441)");
            }
            IconKt.Icon-ww6aTOc(HistoryKt.getHistory(Icons.INSTANCE.getDefault()), "History", SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(18)), $TextSecondary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$5$0(MutableState $showWaiterDialog$delegate) {
        BillingScreen$lambda$91($showWaiterDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$2$5$6(long $TextSecondary, MutableState $selectedWaiter$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1446@96506L411:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(247457849, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1446)");
            }
            IconKt.Icon-ww6aTOc(RoomServiceKt.getRoomService(Icons.INSTANCE.getDefault()), "Waiter", SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(18)), BillingScreen$lambda$78($selectedWaiter$delegate) != null ? ColorKt.getSaSGreen() : $TextSecondary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$7$0(MutableState $ebillEnabled$delegate, boolean it) {
        BillingScreen$lambda$76($ebillEnabled$delegate, it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$6$0$0(MutableState $customerAddress$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $customerAddress$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$6$1$0(BillingViewModel $billingViewModel, final Context $context, MutableState $customerPhone$delegate, MutableState $selectedDialCode$delegate, MutableState $customerName$delegate, MutableState $customerAddress$delegate) {
        if (!StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate))) {
            String fullNumber = BillingScreen$lambda$117($selectedDialCode$delegate) + BillingScreen$lambda$42($customerPhone$delegate);
            $billingViewModel.saveCustomer(BillingScreen$lambda$39($customerName$delegate), fullNumber, BillingScreen$lambda$45($customerAddress$delegate), new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda110
                public final Object invoke(Object obj, Object obj2) {
                    Unit BillingScreen$lambda$140$0$6$2$6$1$0$0;
                    BillingScreen$lambda$140$0$6$2$6$1$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$2$6$1$0$0($context, ((Boolean) obj).booleanValue(), (String) obj2);
                    return BillingScreen$lambda$140$0$6$2$6$1$0$0;
                }
            });
        } else {
            Toast.makeText($context, "Please enter a mobile number", 0).show();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$6$1$0$0(Context $context, boolean success, String msg) {
        Intrinsics.checkNotNullParameter(msg, "msg");
        Toast.makeText($context, msg, 0).show();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$6$3$0(MutableState $kotNote$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $kotNote$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$6$4$0(MutableState $coversCount$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $coversCount$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$6$5$0(MutableState $customerPhone$delegate, MutableState $customerName$delegate, MutableState $customerAddress$delegate, MutableState $kotNote$delegate, MutableState $coversCount$delegate, MutableState $ebillEnabled$delegate, MutableState $selectedWaiter$delegate, MutableState $isComplimentaryOrder$delegate) {
        $customerPhone$delegate.setValue("");
        $customerName$delegate.setValue("");
        $customerAddress$delegate.setValue("");
        $kotNote$delegate.setValue("");
        $coversCount$delegate.setValue("");
        BillingScreen$lambda$76($ebillEnabled$delegate, false);
        $selectedWaiter$delegate.setValue(null);
        BillingScreen$lambda$82($isComplimentaryOrder$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$9$0$0(BillingViewModel $billingViewModel, MutableState $customerPhone$delegate, MutableState $selectedDialCode$delegate, MutableState $customerName$delegate, MutableState $customerAddress$delegate, MutableState $orderType$delegate, MutableState $kotNote$delegate, MutableState $selectedWaiter$delegate, final MutableState $activeSubTab$delegate) {
        String str;
        if (StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate))) {
            str = "";
        } else {
            str = BillingScreen$lambda$117($selectedDialCode$delegate) + BillingScreen$lambda$42($customerPhone$delegate);
        }
        String fullCustomerNumber = str;
        $billingViewModel.saveKOT(BillingScreen$lambda$39($customerName$delegate), fullCustomerNumber, BillingScreen$lambda$45($customerAddress$delegate), BillingScreen$lambda$48($orderType$delegate), BillingScreen$lambda$69($kotNote$delegate), BillingScreen$lambda$78($selectedWaiter$delegate), false, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda19
            public final Object invoke(Object obj) {
                Unit BillingScreen$lambda$140$0$6$2$9$0$0$0;
                BillingScreen$lambda$140$0$6$2$9$0$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$2$9$0$0$0($activeSubTab$delegate, ((Boolean) obj).booleanValue());
                return BillingScreen$lambda$140$0$6$2$9$0$0$0;
            }
        });
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$9$0$0$0(MutableState $activeSubTab$delegate, boolean success) {
        if (success) {
            $activeSubTab$delegate.setValue("BILLING");
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$2$9$1(State $isLoading$delegate, RowScope $this$Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter($this$Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-596952544, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1582)");
            }
            if (BillingScreen$lambda$16($isLoading$delegate)) {
                $composer.startReplaceGroup(1646457535);
                ComposerKt.sourceInformation($composer, "1583@106024L99");
                ProgressIndicatorKt.CircularProgressIndicator-4lLiAd8(SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(14)), Color.Companion.getWhite-0d7_KjU(), Dp.constructor-impl(2), 0L, 0, 0.0f, $composer, 438, 56);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(1646666289);
                ComposerKt.sourceInformation($composer, "1585@106235L81");
                TextKt.Text-Nvy7gAk("Save", (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(12), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597830, 0, 262058);
                $composer.endReplaceGroup();
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$9$2$0(BillingViewModel $billingViewModel, MutableState $customerPhone$delegate, MutableState $selectedDialCode$delegate, MutableState $customerName$delegate, MutableState $customerAddress$delegate, MutableState $orderType$delegate, MutableState $kotNote$delegate, MutableState $selectedWaiter$delegate, final Context $context, final MutableState $activeSubTab$delegate) {
        String str;
        if (StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate))) {
            str = "";
        } else {
            str = BillingScreen$lambda$117($selectedDialCode$delegate) + BillingScreen$lambda$42($customerPhone$delegate);
        }
        String fullCustomerNumber = str;
        $billingViewModel.saveKOT(BillingScreen$lambda$39($customerName$delegate), fullCustomerNumber, BillingScreen$lambda$45($customerAddress$delegate), BillingScreen$lambda$48($orderType$delegate), BillingScreen$lambda$69($kotNote$delegate), BillingScreen$lambda$78($selectedWaiter$delegate), true, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda114
            public final Object invoke(Object obj) {
                Unit BillingScreen$lambda$140$0$6$2$9$2$0$0;
                BillingScreen$lambda$140$0$6$2$9$2$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$2$9$2$0$0($context, $activeSubTab$delegate, ((Boolean) obj).booleanValue());
                return BillingScreen$lambda$140$0$6$2$9$2$0$0;
            }
        });
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$9$2$0$0(Context $context, MutableState $activeSubTab$delegate, boolean success) {
        if (success) {
            $activeSubTab$delegate.setValue("BILLING");
            Toast.makeText($context, "KOT Saved & Printed", 0).show();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$2$9$3(State $isLoading$delegate, RowScope $this$Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter($this$Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1768318949, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1613)");
            }
            if (BillingScreen$lambda$16($isLoading$delegate)) {
                $composer.startReplaceGroup(2079158244);
                ComposerKt.sourceInformation($composer, "1614@108339L99");
                ProgressIndicatorKt.CircularProgressIndicator-4lLiAd8(SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(14)), Color.Companion.getWhite-0d7_KjU(), Dp.constructor-impl(2), 0L, 0, 0.0f, $composer, 438, 56);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(2079359310);
                ComposerKt.sourceInformation($composer, "1616@108542L89");
                TextKt.Text-Nvy7gAk("Print & Save", (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(12), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597830, 0, 262058);
                $composer.endReplaceGroup();
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$0$0$0$0(MutableState $showOldKotDialog$delegate) {
        BillingScreen$lambda$109($showOldKotDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$0$0$1$0(MutableState $showSplitBillDialog$delegate) {
        BillingScreen$lambda$112($showSplitBillDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$2$1$0(Map $billingItems, long $CardDark, long $CardBorderDark, long $TextPrimary, long $TextSecondary, State $posSettings$delegate, LazyListScope $this$LazyColumn) {
        Intrinsics.checkNotNullParameter($this$LazyColumn, "$this$LazyColumn");
        List list = CollectionsKt.toList($billingItems.entrySet());
        $this$LazyColumn.items(list.size(), new BillingScreenKt$BillingScreen$lambda$140$0$6$3$2$1$0$.inlined.items.default.2(new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda247
            public final Object invoke(Object obj) {
                Object BillingScreen$lambda$140$0$6$3$2$1$0$0;
                BillingScreen$lambda$140$0$6$3$2$1$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$3$2$1$0$0((Map.Entry) obj);
                return BillingScreen$lambda$140$0$6$3$2$1$0$0;
            }
        }, list), new BillingScreenKt$BillingScreen$lambda$140$0$6$3$2$1$0$.inlined.items.default.3(BillingScreenKt$BillingScreen$lambda$140$0$6$3$2$1$0$.inlined.items.default.1.INSTANCE, list), ComposableLambdaKt.composableLambdaInstance(802480018, true, new BillingScreenKt$BillingScreen$lambda$140$0$6$3$2$1$0$.inlined.items.default.4(list, $CardDark, $CardBorderDark, $TextPrimary, $TextSecondary, $posSettings$delegate)));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Object BillingScreen$lambda$140$0$6$3$2$1$0$0(Map.Entry it) {
        Intrinsics.checkNotNullParameter(it, "it");
        int id = ((MenuItem) it.getKey()).getId();
        double price = ((MenuItem) it.getKey()).getPrice();
        List selectedModifiers = ((MenuItem) it.getKey()).getSelectedModifiers();
        int hashCode = selectedModifiers != null ? selectedModifiers.hashCode() : 0;
        String kitchenNote = ((MenuItem) it.getKey()).getKitchenNote();
        int hashCode2 = kitchenNote != null ? kitchenNote.hashCode() : 0;
        String priceLabel = ((MenuItem) it.getKey()).getPriceLabel();
        if (priceLabel == null) {
            priceLabel = "";
        }
        return id + "_" + price + "_" + hashCode + "_" + hashCode2 + "_" + priceLabel;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$0$0(Context $context, MutableState $isComplimentaryOrder$delegate) {
        BillingScreen$lambda$82($isComplimentaryOrder$delegate, !BillingScreen$lambda$81($isComplimentaryOrder$delegate));
        Toast.makeText($context, BillingScreen$lambda$81($isComplimentaryOrder$delegate) ? "Complimentary mode enabled" : "Complimentary mode disabled", 0).show();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$3$3$1(long $TextSecondary, MutableState $isComplimentaryOrder$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1785@120876L411:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-464879886, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1785)");
            }
            IconKt.Icon-ww6aTOc(RedeemKt.getRedeem(Icons.INSTANCE.getDefault()), "Complimentary", SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(20)), BillingScreen$lambda$81($isComplimentaryOrder$delegate) ? ColorKt.getSaSGreen() : $TextSecondary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$2$0(Context $context) {
        Toast.makeText($context, "Offers/Coupons opened", 0).show();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$3$3$3(long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1799@121843L372:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-399072229, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1799)");
            }
            IconKt.Icon-ww6aTOc(BookmarkBorderKt.getBookmarkBorder(Icons.INSTANCE.getDefault()), "Offers", SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(20)), $TextSecondary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$4$0(MutableState $showNoteDialog$delegate) {
        BillingScreen$lambda$103($showNoteDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$3$3$5(long $TextSecondary, MutableState $kotNote$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1811@122625L403:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1963937786, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1811)");
            }
            IconKt.Icon-ww6aTOc(NoteAddKt.getNoteAdd(Icons.INSTANCE.getDefault()), "Note", SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(20)), !StringsKt.isBlank(BillingScreen$lambda$69($kotNote$delegate)) ? ColorKt.getSaSGreen() : $TextSecondary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$6$0(MutableState $showCustomerDialog$delegate) {
        BillingScreen$lambda$100($showCustomerDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$3$3$7(long $TextSecondary, MutableState $customerPhone$delegate, MutableState $customerName$delegate, MutableState $customerAddress$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1823@123442L478:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(31980505, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1823)");
            }
            IconKt.Icon-ww6aTOc(PersonKt.getPerson(Icons.INSTANCE.getDefault()), "Customer info", SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(20)), (StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate)) && StringsKt.isBlank(BillingScreen$lambda$39($customerName$delegate)) && StringsKt.isBlank(BillingScreen$lambda$45($customerAddress$delegate))) ? $TextSecondary : ColorKt.getSaSGreen(), $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$8$0(MutableState $showWaiterDialog$delegate) {
        BillingScreen$lambda$91($showWaiterDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$3$3$9(long $TextSecondary, MutableState $selectedWaiter$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1835@124332L411:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1899976776, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1835)");
            }
            IconKt.Icon-ww6aTOc(RoomServiceKt.getRoomService(Icons.INSTANCE.getDefault()), "Waiter", SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(20)), BillingScreen$lambda$78($selectedWaiter$delegate) != null ? ColorKt.getSaSGreen() : $TextSecondary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$10$0(MutableState $ebillEnabled$delegate) {
        BillingScreen$lambda$76($ebillEnabled$delegate, !BillingScreen$lambda$75($ebillEnabled$delegate));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$11$0$0(MutableState $ebillEnabled$delegate, boolean it) {
        BillingScreen$lambda$76($ebillEnabled$delegate, it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$5$1$0$0(MutableState $showPreviewDialog$delegate) {
        BillingScreen$lambda$97($showPreviewDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$5$1$1$0(BillingViewModel $billingViewModel, Order $activeOrder, Map $billingItems, double $subtotal, double $discount, double $cgst, double $sgst, double $serviceCharge, double $deliveryCharge, double $finalTotal, double $advancePaid, double $remainingBalance, UserProfile $user, MutableState $customerName$delegate, MutableState $customerPhone$delegate, MutableState $selectedDialCode$delegate, MutableState $customerAddress$delegate, MutableState $orderType$delegate, State $selectedTable$delegate, MutableState $selectedWaiter$delegate, MutableState $paymentMethod$delegate) {
        String str;
        String str2;
        String username;
        if ($activeOrder == null || (str = $activeOrder.getBillNo()) == null) {
            str = "NEW";
        }
        String str3 = str;
        String BillingScreen$lambda$39 = BillingScreen$lambda$39($customerName$delegate);
        String str4 = StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate)) ? "" : BillingScreen$lambda$117($selectedDialCode$delegate) + BillingScreen$lambda$42($customerPhone$delegate);
        String BillingScreen$lambda$45 = BillingScreen$lambda$45($customerAddress$delegate);
        String BillingScreen$lambda$48 = BillingScreen$lambda$48($orderType$delegate);
        TableItem BillingScreen$lambda$15 = BillingScreen$lambda$15($selectedTable$delegate);
        if (BillingScreen$lambda$15 == null || (str2 = BillingScreen$lambda$15.getTableName()) == null) {
            str2 = "Direct";
        }
        String str5 = str2;
        String BillingScreen$lambda$78 = BillingScreen$lambda$78($selectedWaiter$delegate);
        String BillingScreen$lambda$51 = BillingScreen$lambda$51($paymentMethod$delegate);
        if ($user == null || (username = $user.getName()) == null) {
            username = $user != null ? $user.getUsername() : null;
            if (username == null) {
                username = "admin";
            }
        }
        BillingViewModel.triggerBillPrint$default($billingViewModel, str3, BillingScreen$lambda$39, str4, BillingScreen$lambda$45, BillingScreen$lambda$48, $billingItems, $subtotal, $discount, $cgst, $sgst, $serviceCharge, $deliveryCharge, $finalTotal, str5, BillingScreen$lambda$78, $advancePaid, $remainingBalance, BillingScreen$lambda$51, username, (String) null, 0.0d, 1572864, (Object) null);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$5$1$2$0(MutableState $showDiscountDialog$delegate) {
        BillingScreen$lambda$85($showDiscountDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$3$5$1$3(double $discount, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1960@133556L424:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1703341726, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1960)");
            }
            IconKt.Icon-ww6aTOc(LocalOfferKt.getLocalOffer(Icons.INSTANCE.getDefault()), "Discount", SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(18)), $discount > 0.0d ? Color.Companion.getYellow-0d7_KjU() : Color.Companion.getWhite-0d7_KjU(), $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$5$1$4$0(MutableState $showChargesDialog$delegate) {
        BillingScreen$lambda$88($showChargesDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$3$5$1$5(double $serviceCharge, double $deliveryCharge, MutableState $orderType$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1971@134347L488:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1696252029, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1971)");
            }
            IconKt.Icon-ww6aTOc(AccountBalanceWalletKt.getAccountBalanceWallet(Icons.INSTANCE.getDefault()), "Charges", SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(18)), ($serviceCharge > 0.0d || $deliveryCharge > 0.0d || Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER")) ? Color.Companion.getYellow-0d7_KjU() : Color.Companion.getWhite-0d7_KjU(), $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$6$0$0$0(BillingViewModel $billingViewModel, double $discount, double $serviceCharge, double $deliveryCharge, double $cgst, double $sgst, double $advancePaid, double $remainingBalance, UserProfile $user, MutableState $customerPhone$delegate, MutableState $selectedDialCode$delegate, MutableState $customerName$delegate, MutableState $customerAddress$delegate, MutableState $paymentMethod$delegate, MutableState $orderType$delegate, MutableState $preOrderIdInput$delegate, State $selectedTable$delegate, MutableState $selectedWaiter$delegate, final Context $context) {
        String str;
        String str2;
        String str3;
        String fullCustomerNumber = StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate)) ? "" : BillingScreen$lambda$117($selectedDialCode$delegate) + BillingScreen$lambda$42($customerPhone$delegate);
        String BillingScreen$lambda$39 = BillingScreen$lambda$39($customerName$delegate);
        String BillingScreen$lambda$45 = BillingScreen$lambda$45($customerAddress$delegate);
        String BillingScreen$lambda$51 = BillingScreen$lambda$51($paymentMethod$delegate);
        String BillingScreen$lambda$48 = BillingScreen$lambda$48($orderType$delegate);
        String BillingScreen$lambda$63 = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? BillingScreen$lambda$63($preOrderIdInput$delegate) : null;
        Double valueOf = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? Double.valueOf($advancePaid) : null;
        Double valueOf2 = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? Double.valueOf($remainingBalance) : null;
        TableItem BillingScreen$lambda$15 = BillingScreen$lambda$15($selectedTable$delegate);
        if (BillingScreen$lambda$15 == null || (str = BillingScreen$lambda$15.getTableName()) == null) {
            str = "Direct";
        }
        String str4 = str;
        String BillingScreen$lambda$78 = BillingScreen$lambda$78($selectedWaiter$delegate);
        if ($user == null || (str3 = $user.getName()) == null) {
            String username = $user != null ? $user.getUsername() : null;
            if (username != null) {
                str2 = username;
                BillingViewModel.settleOrder$default($billingViewModel, BillingScreen$lambda$39, fullCustomerNumber, BillingScreen$lambda$45, BillingScreen$lambda$51, BillingScreen$lambda$48, $discount, $serviceCharge, $deliveryCharge, $cgst, $sgst, BillingScreen$lambda$63, valueOf, valueOf2, str4, BillingScreen$lambda$78, false, "SAVE", str2, (String) null, 0.0d, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda37
                    public final Object invoke(Object obj) {
                        Unit BillingScreen$lambda$140$0$6$3$6$0$0$0$0;
                        BillingScreen$lambda$140$0$6$3$6$0$0$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$3$6$0$0$0$0($context, ((Boolean) obj).booleanValue());
                        return BillingScreen$lambda$140$0$6$3$6$0$0$0$0;
                    }
                }, 786432, (Object) null);
                return Unit.INSTANCE;
            }
            str3 = "admin";
        }
        str2 = str3;
        BillingViewModel.settleOrder$default($billingViewModel, BillingScreen$lambda$39, fullCustomerNumber, BillingScreen$lambda$45, BillingScreen$lambda$51, BillingScreen$lambda$48, $discount, $serviceCharge, $deliveryCharge, $cgst, $sgst, BillingScreen$lambda$63, valueOf, valueOf2, str4, BillingScreen$lambda$78, false, "SAVE", str2, (String) null, 0.0d, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda37
            public final Object invoke(Object obj) {
                Unit BillingScreen$lambda$140$0$6$3$6$0$0$0$0;
                BillingScreen$lambda$140$0$6$3$6$0$0$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$3$6$0$0$0$0($context, ((Boolean) obj).booleanValue());
                return BillingScreen$lambda$140$0$6$3$6$0$0$0$0;
            }
        }, 786432, (Object) null);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$6$0$0$0$0(Context $context, boolean success) {
        if (success) {
            Toast.makeText($context, "Bill Saved", 0).show();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$6$0$1$0(BillingViewModel $billingViewModel, double $discount, double $serviceCharge, double $deliveryCharge, double $cgst, double $sgst, double $advancePaid, double $remainingBalance, UserProfile $user, MutableState $customerPhone$delegate, MutableState $selectedDialCode$delegate, MutableState $customerName$delegate, MutableState $customerAddress$delegate, MutableState $paymentMethod$delegate, MutableState $orderType$delegate, MutableState $preOrderIdInput$delegate, State $selectedTable$delegate, MutableState $selectedWaiter$delegate, final Context $context) {
        String str;
        String str2;
        String str3;
        String fullCustomerNumber = StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate)) ? "" : BillingScreen$lambda$117($selectedDialCode$delegate) + BillingScreen$lambda$42($customerPhone$delegate);
        String BillingScreen$lambda$39 = BillingScreen$lambda$39($customerName$delegate);
        String BillingScreen$lambda$45 = BillingScreen$lambda$45($customerAddress$delegate);
        String BillingScreen$lambda$51 = BillingScreen$lambda$51($paymentMethod$delegate);
        String BillingScreen$lambda$48 = BillingScreen$lambda$48($orderType$delegate);
        String BillingScreen$lambda$63 = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? BillingScreen$lambda$63($preOrderIdInput$delegate) : null;
        Double valueOf = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? Double.valueOf($advancePaid) : null;
        Double valueOf2 = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? Double.valueOf($remainingBalance) : null;
        TableItem BillingScreen$lambda$15 = BillingScreen$lambda$15($selectedTable$delegate);
        if (BillingScreen$lambda$15 == null || (str = BillingScreen$lambda$15.getTableName()) == null) {
            str = "Direct";
        }
        String str4 = str;
        String BillingScreen$lambda$78 = BillingScreen$lambda$78($selectedWaiter$delegate);
        if ($user == null || (str3 = $user.getName()) == null) {
            String username = $user != null ? $user.getUsername() : null;
            if (username != null) {
                str2 = username;
                BillingViewModel.settleOrder$default($billingViewModel, BillingScreen$lambda$39, fullCustomerNumber, BillingScreen$lambda$45, BillingScreen$lambda$51, BillingScreen$lambda$48, $discount, $serviceCharge, $deliveryCharge, $cgst, $sgst, BillingScreen$lambda$63, valueOf, valueOf2, str4, BillingScreen$lambda$78, true, "PRINT", str2, (String) null, 0.0d, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda248
                    public final Object invoke(Object obj) {
                        Unit BillingScreen$lambda$140$0$6$3$6$0$1$0$0;
                        BillingScreen$lambda$140$0$6$3$6$0$1$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$3$6$0$1$0$0($context, ((Boolean) obj).booleanValue());
                        return BillingScreen$lambda$140$0$6$3$6$0$1$0$0;
                    }
                }, 786432, (Object) null);
                return Unit.INSTANCE;
            }
            str3 = "admin";
        }
        str2 = str3;
        BillingViewModel.settleOrder$default($billingViewModel, BillingScreen$lambda$39, fullCustomerNumber, BillingScreen$lambda$45, BillingScreen$lambda$51, BillingScreen$lambda$48, $discount, $serviceCharge, $deliveryCharge, $cgst, $sgst, BillingScreen$lambda$63, valueOf, valueOf2, str4, BillingScreen$lambda$78, true, "PRINT", str2, (String) null, 0.0d, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda248
            public final Object invoke(Object obj) {
                Unit BillingScreen$lambda$140$0$6$3$6$0$1$0$0;
                BillingScreen$lambda$140$0$6$3$6$0$1$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$3$6$0$1$0$0($context, ((Boolean) obj).booleanValue());
                return BillingScreen$lambda$140$0$6$3$6$0$1$0$0;
            }
        }, 786432, (Object) null);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$6$0$1$0$0(Context $context, boolean success) {
        if (success) {
            Toast.makeText($context, "Bill Saved & Printed", 0).show();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$6$0$2$0(MutableState $showPaymentDialog$delegate) {
        BillingScreen$lambda$106($showPaymentDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$6$1$0(BillingViewModel $billingViewModel, double $discount, double $serviceCharge, double $deliveryCharge, double $cgst, double $sgst, double $advancePaid, double $remainingBalance, UserProfile $user, MutableState $customerPhone$delegate, MutableState $selectedDialCode$delegate, MutableState $customerName$delegate, MutableState $customerAddress$delegate, MutableState $paymentMethod$delegate, MutableState $orderType$delegate, MutableState $preOrderIdInput$delegate, State $selectedTable$delegate, MutableState $selectedWaiter$delegate, final Context $context) {
        String str;
        String str2;
        String str3;
        String fullCustomerNumber = StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate)) ? "" : BillingScreen$lambda$117($selectedDialCode$delegate) + BillingScreen$lambda$42($customerPhone$delegate);
        String BillingScreen$lambda$39 = BillingScreen$lambda$39($customerName$delegate);
        String BillingScreen$lambda$45 = BillingScreen$lambda$45($customerAddress$delegate);
        String BillingScreen$lambda$51 = BillingScreen$lambda$51($paymentMethod$delegate);
        String BillingScreen$lambda$48 = BillingScreen$lambda$48($orderType$delegate);
        String BillingScreen$lambda$63 = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? BillingScreen$lambda$63($preOrderIdInput$delegate) : null;
        Double valueOf = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? Double.valueOf($advancePaid) : null;
        Double valueOf2 = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? Double.valueOf($remainingBalance) : null;
        TableItem BillingScreen$lambda$15 = BillingScreen$lambda$15($selectedTable$delegate);
        if (BillingScreen$lambda$15 == null || (str = BillingScreen$lambda$15.getTableName()) == null) {
            str = "Direct";
        }
        String str4 = str;
        String BillingScreen$lambda$78 = BillingScreen$lambda$78($selectedWaiter$delegate);
        if ($user == null || (str3 = $user.getName()) == null) {
            String username = $user != null ? $user.getUsername() : null;
            if (username != null) {
                str2 = username;
                BillingViewModel.settleOrder$default($billingViewModel, BillingScreen$lambda$39, fullCustomerNumber, BillingScreen$lambda$45, BillingScreen$lambda$51, BillingScreen$lambda$48, $discount, $serviceCharge, $deliveryCharge, $cgst, $sgst, BillingScreen$lambda$63, valueOf, valueOf2, str4, BillingScreen$lambda$78, false, "SETTLE", str2, (String) null, 0.0d, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda24
                    public final Object invoke(Object obj) {
                        Unit BillingScreen$lambda$140$0$6$3$6$1$0$0;
                        BillingScreen$lambda$140$0$6$3$6$1$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$3$6$1$0$0($context, ((Boolean) obj).booleanValue());
                        return BillingScreen$lambda$140$0$6$3$6$1$0$0;
                    }
                }, 786432, (Object) null);
                return Unit.INSTANCE;
            }
            str3 = "admin";
        }
        str2 = str3;
        BillingViewModel.settleOrder$default($billingViewModel, BillingScreen$lambda$39, fullCustomerNumber, BillingScreen$lambda$45, BillingScreen$lambda$51, BillingScreen$lambda$48, $discount, $serviceCharge, $deliveryCharge, $cgst, $sgst, BillingScreen$lambda$63, valueOf, valueOf2, str4, BillingScreen$lambda$78, false, "SETTLE", str2, (String) null, 0.0d, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda24
            public final Object invoke(Object obj) {
                Unit BillingScreen$lambda$140$0$6$3$6$1$0$0;
                BillingScreen$lambda$140$0$6$3$6$1$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$3$6$1$0$0($context, ((Boolean) obj).booleanValue());
                return BillingScreen$lambda$140$0$6$3$6$1$0$0;
            }
        }, 786432, (Object) null);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$6$1$0$0(Context $context, boolean success) {
        if (success) {
            Toast.makeText($context, "Bill Settled successfully", 0).show();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$6$3$6$2(State $isLoading$delegate, RowScope $this$Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter($this$Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(485025286, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2111)");
            }
            if (BillingScreen$lambda$16($isLoading$delegate)) {
                $composer.startReplaceGroup(1118424665);
                ComposerKt.sourceInformation($composer, "2112@145692L99");
                ProgressIndicatorKt.CircularProgressIndicator-4lLiAd8(SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(14)), Color.Companion.getWhite-0d7_KjU(), Dp.constructor-impl(2), 0L, 0, 0.0f, $composer, 438, 56);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(1118623716);
                ComposerKt.sourceInformation($composer, "2114@145893L88");
                TextKt.Text-Nvy7gAk("Settle Bill", (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(14), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597830, 0, 262058);
                $composer.endReplaceGroup();
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$7$0(MutableState $showDiscountDialog$delegate) {
        BillingScreen$lambda$85($showDiscountDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$8(long $CardDark, final long $CardBorderDark, final Map $billingItems, final long $TextSecondary, final MutableState $discountInput$delegate, final State $posSettings$delegate, final long $InputDark, final MutableState $showDiscountDialog$delegate, final long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2130@146546L37,2133@146750L4607,2128@146435L4922:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1299720154, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2128)");
            }
            CardKt.Card(PaddingKt.padding-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(16)), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(16)), CardDefaults.INSTANCE.cardColors-ro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), (CardElevation) null, BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(-482418828, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda101
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$8$0;
                    BillingScreen$lambda$140$0$8$0 = BillingScreenKt.BillingScreen$lambda$140$0$8$0($CardBorderDark, $billingItems, $TextSecondary, $discountInput$delegate, $posSettings$delegate, $InputDark, $showDiscountDialog$delegate, $TextPrimary, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$8$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:63:0x0985, code lost:
    
        if (r7 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L73;
     */
    @androidx.compose.runtime.ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @androidx.compose.runtime.Composable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit BillingScreen$lambda$140$0$8$0(long r135, java.util.Map r137, final long r138, final androidx.compose.runtime.MutableState r140, androidx.compose.runtime.State r141, long r142, final androidx.compose.runtime.MutableState r144, final long r145, androidx.compose.foundation.layout.ColumnScope r147, androidx.compose.runtime.Composer r148, int r149) {
        /*
            Method dump skipped, instructions count: 2556
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen$lambda$140$0$8$0(long, java.util.Map, long, androidx.compose.runtime.MutableState, androidx.compose.runtime.State, long, androidx.compose.runtime.MutableState, long, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    private static final String BillingScreen$lambda$140$0$8$0$0$1(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$8$0$0$3$0(MutableState $discountVal$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $discountVal$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$8$0$0$4(long $TextSecondary, State $posSettings$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2151@147679L72:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1060687588, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2151)");
            }
            TextKt.Text-Nvy7gAk("Discount Amount (" + BillingScreen$lambda$20($posSettings$delegate).getCurrency() + ")", (Modifier) null, $TextSecondary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 0, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$8$0$0$6$0$0$0(double $amt, State $posSettings$delegate, MutableState $discountVal$delegate) {
        $discountVal$delegate.setValue(formatPrice($amt, BillingScreen$lambda$20($posSettings$delegate)));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$8$0$0$7$0$0(MutableState $showDiscountDialog$delegate) {
        BillingScreen$lambda$85($showDiscountDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$8$0$0$7$1(long $TextPrimary, RowScope $this$Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter($this$Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C2197@150639L35:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-395816941, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2197)");
            }
            TextKt.Text-Nvy7gAk("Cancel", (Modifier) null, $TextPrimary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$8$0$0$7$2$0(MutableState $discountVal$delegate, MutableState $discountInput$delegate, MutableState $showDiscountDialog$delegate) {
        $discountInput$delegate.setValue(BillingScreen$lambda$140$0$8$0$0$1($discountVal$delegate));
        BillingScreen$lambda$85($showDiscountDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$9$0(MutableState $showChargesDialog$delegate) {
        BillingScreen$lambda$88($showChargesDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$10(long $CardDark, final long $CardBorderDark, final long $TextSecondary, final MutableState $serviceChargeInput$delegate, final MutableState $deliveryChargeInput$delegate, final MutableState $preOrderIdInput$delegate, final MutableState $advancePaidInput$delegate, final long $InputDark, final MutableState $orderType$delegate, final State $posSettings$delegate, final State $activeFlow$delegate, final MutableState $showChargesDialog$delegate, final long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2219@151634L37,2222@151838L7565,2217@151523L7880:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1078987569, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2217)");
            }
            CardKt.Card(PaddingKt.padding-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(16)), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(16)), CardDefaults.INSTANCE.cardColors-ro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), (CardElevation) null, BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(-1631428451, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda12
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$10$0;
                    BillingScreen$lambda$140$0$10$0 = BillingScreenKt.BillingScreen$lambda$140$0$10$0($TextSecondary, $CardBorderDark, $serviceChargeInput$delegate, $deliveryChargeInput$delegate, $preOrderIdInput$delegate, $advancePaidInput$delegate, $InputDark, $orderType$delegate, $posSettings$delegate, $activeFlow$delegate, $showChargesDialog$delegate, $TextPrimary, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$10$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:56:0x06b1, code lost:
    
        if (r15 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L62;
     */
    /* JADX WARN: Code restructure failed: missing block: B:63:0x07f8, code lost:
    
        if (r1 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L72;
     */
    /* JADX WARN: Code restructure failed: missing block: B:98:0x0a6b, code lost:
    
        if (r6 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L95;
     */
    @androidx.compose.runtime.ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @androidx.compose.runtime.Composable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit BillingScreen$lambda$140$0$10$0(final long r150, long r152, final androidx.compose.runtime.MutableState r154, final androidx.compose.runtime.MutableState r155, final androidx.compose.runtime.MutableState r156, final androidx.compose.runtime.MutableState r157, long r158, final androidx.compose.runtime.MutableState r160, final androidx.compose.runtime.State r161, androidx.compose.runtime.State r162, androidx.compose.runtime.MutableState r163, final long r164, androidx.compose.foundation.layout.ColumnScope r166, androidx.compose.runtime.Composer r167, int r168) {
        /*
            Method dump skipped, instructions count: 3419
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen$lambda$140$0$10$0(long, long, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, long, androidx.compose.runtime.MutableState, androidx.compose.runtime.State, androidx.compose.runtime.State, androidx.compose.runtime.MutableState, long, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$0$0$0$0(String $type, MutableState $orderType$delegate) {
        $orderType$delegate.setValue($type);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$1$0(MutableState $serviceChargeInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $serviceChargeInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$10$0$0$2(long $TextSecondary, State $posSettings$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2266@154462L71:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-469879795, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2266)");
            }
            TextKt.Text-Nvy7gAk("Service Charge (" + BillingScreen$lambda$20($posSettings$delegate).getCurrency() + ")", (Modifier) null, $TextSecondary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 0, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$3$0(MutableState $deliveryChargeInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $deliveryChargeInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$10$0$0$4(long $TextSecondary, State $posSettings$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2282@155482L72:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1113469230, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2282)");
            }
            TextKt.Text-Nvy7gAk("Delivery Charge (" + BillingScreen$lambda$20($posSettings$delegate).getCurrency() + ")", (Modifier) null, $TextSecondary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 0, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$5$0(MutableState $preOrderIdInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $preOrderIdInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$10$0$0$6(long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2299@156594L43:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-833100037, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2299)");
            }
            TextKt.Text-Nvy7gAk("Pre-Order ID", (Modifier) null, $TextSecondary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$7$0(MutableState $advancePaidInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $advancePaidInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$10$0$0$8(long $TextSecondary, State $posSettings$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2312@157452L69:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-278935836, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2312)");
            }
            TextKt.Text-Nvy7gAk("Advance Paid (" + BillingScreen$lambda$20($posSettings$delegate).getCurrency() + ")", (Modifier) null, $TextSecondary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 0, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$9$0$0(MutableState $showChargesDialog$delegate) {
        BillingScreen$lambda$88($showChargesDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$10$0$0$9$1(long $TextPrimary, RowScope $this$Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter($this$Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C2334@158831L35:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-11393668, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2334)");
            }
            TextKt.Text-Nvy7gAk("Cancel", (Modifier) null, $TextPrimary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$9$2$0(MutableState $showChargesDialog$delegate) {
        BillingScreen$lambda$88($showChargesDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$11$0(MutableState $showWaiterDialog$delegate) {
        BillingScreen$lambda$91($showWaiterDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$12(long $CardDark, long $CardBorderDark, final MutableState $selectedWaiter$delegate, final long $InputDark, final long $TextPrimary, final State $staffList$delegate, final MutableState $showWaiterDialog$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2353@159678L37,2356@159882L4477,2351@159567L4792:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1512951250, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2351)");
            }
            CardKt.Card(PaddingKt.padding-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(16)), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(16)), CardDefaults.INSTANCE.cardColors-ro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), (CardElevation) null, BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(-2065392132, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda77
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$12$0;
                    BillingScreen$lambda$140$0$12$0 = BillingScreenKt.BillingScreen$lambda$140$0$12$0($selectedWaiter$delegate, $InputDark, $TextPrimary, $staffList$delegate, $showWaiterDialog$delegate, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$12$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:56:0x0208, code lost:
    
        if (r5 == null) goto L33;
     */
    /* JADX WARN: Removed duplicated region for block: B:38:0x05f5  */
    /* JADX WARN: Removed duplicated region for block: B:41:0x0670  */
    /* JADX WARN: Removed duplicated region for block: B:45:0x0603  */
    @androidx.compose.runtime.ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @androidx.compose.runtime.Composable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit BillingScreen$lambda$140$0$12$0(final androidx.compose.runtime.MutableState r82, final long r83, final long r85, androidx.compose.runtime.State r87, androidx.compose.runtime.MutableState r88, androidx.compose.foundation.layout.ColumnScope r89, androidx.compose.runtime.Composer r90, int r91) {
        /*
            Method dump skipped, instructions count: 1660
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen$lambda$140$0$12$0(androidx.compose.runtime.MutableState, long, long, androidx.compose.runtime.State, androidx.compose.runtime.MutableState, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$12$0$0$1$0(List $waiters, long $InputDark, MutableState $selectedWaiter$delegate, MutableState $showWaiterDialog$delegate, long $TextPrimary, LazyListScope $this$LazyColumn) {
        Intrinsics.checkNotNullParameter($this$LazyColumn, "$this$LazyColumn");
        $this$LazyColumn.items($waiters.size(), (Function1) null, new BillingScreenKt$BillingScreen$lambda$140$0$12$0$0$1$0$.inlined.items.default.3(BillingScreenKt$BillingScreen$lambda$140$0$12$0$0$1$0$.inlined.items.default.1.INSTANCE, $waiters), ComposableLambdaKt.composableLambdaInstance(802480018, true, new BillingScreenKt$BillingScreen$lambda$140$0$12$0$0$1$0$.inlined.items.default.4($waiters, $InputDark, $selectedWaiter$delegate, $showWaiterDialog$delegate, $TextPrimary)));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$12$0$0$2$0$0(MutableState $selectedWaiter$delegate, MutableState $showWaiterDialog$delegate) {
        $selectedWaiter$delegate.setValue(null);
        BillingScreen$lambda$91($showWaiterDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$12$0$0$2$1$0(MutableState $showWaiterDialog$delegate) {
        BillingScreen$lambda$91($showWaiterDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$12$0$0$2$2(long $TextPrimary, RowScope $this$Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter($this$Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C2429@164213L34:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-844723685, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2429)");
            }
            TextKt.Text-Nvy7gAk("Close", (Modifier) null, $TextPrimary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$13$0(BillingViewModel $billingViewModel, MutableState $showCustomerDialog$delegate) {
        BillingScreen$lambda$100($showCustomerDialog$delegate, false);
        $billingViewModel.clearSearchResults();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$14(final long $CardDark, final long $CardBorderDark, final MutableState $customerPhone$delegate, final MutableState $customerName$delegate, final MutableState $customerAddress$delegate, final BillingViewModel $billingViewModel, final long $TextSecondary, final MutableState $selectedCountryCode$delegate, final MutableState $selectedCountryFlag$delegate, final MutableState $selectedDialCode$delegate, final long $TextPrimary, final long $InputDark, final Context $context, final MutableState $showCustomerDialog$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2444@164732L37,2447@164936L8815,2442@164621L9130:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1946914931, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2442)");
            }
            CardKt.Card(PaddingKt.padding-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(16)), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(16)), CardDefaults.INSTANCE.cardColors-ro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), (CardElevation) null, BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(1795611483, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda67
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$14$0;
                    BillingScreen$lambda$140$0$14$0 = BillingScreenKt.BillingScreen$lambda$140$0$14$0($CardBorderDark, $customerPhone$delegate, $customerName$delegate, $customerAddress$delegate, $billingViewModel, $CardDark, $TextSecondary, $selectedCountryCode$delegate, $selectedCountryFlag$delegate, $selectedDialCode$delegate, $TextPrimary, $InputDark, $context, $showCustomerDialog$delegate, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$14$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:33:0x0414, code lost:
    
        if (r7 != androidx.compose.runtime.Composer.Companion.getEmpty()) goto L45;
     */
    @androidx.compose.runtime.ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @androidx.compose.runtime.Composable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit BillingScreen$lambda$140$0$14$0(long r228, final androidx.compose.runtime.MutableState r230, final androidx.compose.runtime.MutableState r231, final androidx.compose.runtime.MutableState r232, final com.example.sasloopmanager.BillingViewModel r233, long r234, final long r236, final androidx.compose.runtime.MutableState r238, final androidx.compose.runtime.MutableState r239, final androidx.compose.runtime.MutableState r240, final long r241, long r243, final android.content.Context r245, final androidx.compose.runtime.MutableState r246, androidx.compose.foundation.layout.ColumnScope r247, androidx.compose.runtime.Composer r248, int r249) {
        /*
            Method dump skipped, instructions count: 2662
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen$lambda$140$0$14$0(long, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, com.example.sasloopmanager.BillingViewModel, long, long, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, long, long, android.content.Context, androidx.compose.runtime.MutableState, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    private static final String BillingScreen$lambda$140$0$14$0$0$1(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$140$0$14$0$0$4(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$140$0$14$0$0$7(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$9$0$0(BillingViewModel $billingViewModel, MutableState $phoneVal$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $phoneVal$delegate.setValue(it);
        $billingViewModel.searchCustomers(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$14$0$0$9$1(long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2471@166221L46:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(961658757, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2471)");
            }
            TextKt.Text-Nvy7gAk("Customer Mobile", (Modifier) null, $TextSecondary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    private static final List<SearchedCustomer> BillingScreen$lambda$140$0$14$0$0$9$2(State<? extends List<SearchedCustomer>> state) {
        return (List) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$9$3$0(BillingViewModel $billingViewModel) {
        $billingViewModel.clearSearchResults();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$14$0$0$9$4(State $dialogSearchResults$delegate, final MutableState $selectedCountryCode$delegate, final MutableState $selectedCountryFlag$delegate, final MutableState $selectedDialCode$delegate, final BillingViewModel $billingViewModel, final long $TextPrimary, final long $TextSecondary, final MutableState $phoneVal$delegate, final MutableState $nameVal$delegate, final MutableState $addressVal$delegate, ColumnScope $this$DropdownMenu, Composer $composer, int $changed) {
        Composer composer = $composer;
        Intrinsics.checkNotNullParameter($this$DropdownMenu, "$this$DropdownMenu");
        ComposerKt.sourceInformation(composer, "C*2495@167934L1501,2517@169491L970,2494@167865L2638:BillingScreen.kt#7ez3px");
        boolean z = true;
        if (!composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-955569958, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2493)");
            }
            for (final SearchedCustomer searchedCustomer : BillingScreen$lambda$140$0$14$0$0$9$2($dialogSearchResults$delegate)) {
                Function2 rememberComposableLambda = ComposableLambdaKt.rememberComposableLambda(1874826190, z, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda20
                    public final Object invoke(Object obj, Object obj2) {
                        Unit BillingScreen$lambda$140$0$14$0$0$9$4$0$0;
                        BillingScreen$lambda$140$0$14$0$0$9$4$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$14$0$0$9$4$0$0(searchedCustomer, $TextPrimary, $TextSecondary, (Composer) obj, ((Integer) obj2).intValue());
                        return BillingScreen$lambda$140$0$14$0$0$9$4$0$0;
                    }
                }, composer, 54);
                ComposerKt.sourceInformationMarkerStart(composer, 1461929960, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changed = composer.changed(searchedCustomer) | composer.changed($selectedCountryCode$delegate) | composer.changed($selectedCountryFlag$delegate) | composer.changed($selectedDialCode$delegate) | composer.changedInstance($billingViewModel);
                Object rememberedValue = $composer.rememberedValue();
                if (changed || rememberedValue == Composer.Companion.getEmpty()) {
                    rememberedValue = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda21
                        public final Object invoke() {
                            Unit BillingScreen$lambda$140$0$14$0$0$9$4$0$1$0;
                            BillingScreen$lambda$140$0$14$0$0$9$4$0$1$0 = BillingScreenKt.BillingScreen$lambda$140$0$14$0$0$9$4$0$1$0(searchedCustomer, $billingViewModel, $selectedCountryCode$delegate, $selectedCountryFlag$delegate, $selectedDialCode$delegate, $phoneVal$delegate, $nameVal$delegate, $addressVal$delegate);
                            return BillingScreen$lambda$140$0$14$0$0$9$4$0$1$0;
                        }
                    };
                    $composer.updateRememberedValue(rememberedValue);
                }
                ComposerKt.sourceInformationMarkerEnd(composer);
                AndroidMenu_androidKt.DropdownMenuItem(rememberComposableLambda, (Function0) rememberedValue, (Modifier) null, (Function2) null, (Function2) null, false, (MenuItemColors) null, (PaddingValues) null, (MutableInteractionSource) null, composer, 6, 508);
                composer = $composer;
                z = true;
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$14$0$0$9$4$0$0(SearchedCustomer $customer, long $TextPrimary, long $TextSecondary, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C2496@167984L1405:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1874826190, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2496)");
            }
            Modifier modifier = PaddingKt.padding-VpY3zN4$default(Modifier.Companion, 0.0f, Dp.constructor-impl(4), 1, (Object) null);
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), $composer, ((6 >> 3) & 14) | ((6 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = ((((6 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, columnMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope = ColumnScopeInstance.INSTANCE;
            int i3 = ((6 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 1254847947, "C2497@168091L387,2503@168531L297:BillingScreen.kt#7ez3px");
            String name = $customer.getName();
            if (name == null) {
                name = "Customer";
            }
            TextKt.Text-Nvy7gAk(name, (Modifier) null, $TextPrimary, (TextAutoSize) null, TextUnitKt.getSp(12), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597440, 0, 262058);
            String number = $customer.getNumber();
            if (number == null) {
                number = "";
            }
            TextKt.Text-Nvy7gAk(number, (Modifier) null, $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 24576, 0, 262122);
            String address = $customer.getAddress();
            if (!(address == null || StringsKt.isBlank(address))) {
                $composer.startReplaceGroup(1255644615);
                ComposerKt.sourceInformation($composer, "2509@168978L307");
                TextKt.Text-Nvy7gAk($customer.getAddress(), (Modifier) null, $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(9), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 24576, 0, 262122);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(1256047274);
                $composer.endReplaceGroup();
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$9$4$0$1$0(SearchedCustomer $customer, BillingViewModel $billingViewModel, MutableState $selectedCountryCode$delegate, MutableState $selectedCountryFlag$delegate, MutableState $selectedDialCode$delegate, MutableState $phoneVal$delegate, MutableState $nameVal$delegate, MutableState $addressVal$delegate) {
        Object obj;
        String str;
        String fullPhone = $customer.getNumber();
        if (fullPhone == null) {
            fullPhone = "";
        }
        Triple parsed = parsePhoneNumber(fullPhone);
        Iterator<T> it = countryCodes.iterator();
        while (true) {
            if (!it.hasNext()) {
                obj = null;
                break;
            }
            obj = it.next();
            if (Intrinsics.areEqual(((CountryCodeItem) obj).getCode(), parsed.getFirst())) {
                break;
            }
        }
        CountryCodeItem outerCountry = (CountryCodeItem) obj;
        $selectedCountryCode$delegate.setValue((String) parsed.getFirst());
        $selectedCountryFlag$delegate.setValue((String) parsed.getSecond());
        if (outerCountry == null || (str = outerCountry.getDialCode()) == null) {
            str = "+91";
        }
        $selectedDialCode$delegate.setValue(str);
        $phoneVal$delegate.setValue((String) parsed.getThird());
        String name = $customer.getName();
        if (name == null) {
            name = "";
        }
        $nameVal$delegate.setValue(name);
        String address = $customer.getAddress();
        $addressVal$delegate.setValue(address != null ? address : "");
        $billingViewModel.clearSearchResults();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$10$0(MutableState $nameVal$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $nameVal$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$14$0$0$11(long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2538@170811L44:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1337807157, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2538)");
            }
            TextKt.Text-Nvy7gAk("Customer Name", (Modifier) null, $TextSecondary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$12$0(MutableState $addressVal$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $addressVal$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$14$0$0$13(long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2552@171607L47:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1686870988, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2552)");
            }
            TextKt.Text-Nvy7gAk("Customer Address", (Modifier) null, $TextSecondary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$14$0$0(MutableState $showCustomerDialog$delegate) {
        BillingScreen$lambda$100($showCustomerDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$14$0$0$14$1(long $TextPrimary, RowScope $this$Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter($this$Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C2572@172791L35:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-2052049839, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2572)");
            }
            TextKt.Text-Nvy7gAk("Cancel", (Modifier) null, $TextPrimary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$14$2$0(Context $context, MutableState $phoneVal$delegate, MutableState $customerPhone$delegate, MutableState $nameVal$delegate, MutableState $customerName$delegate, MutableState $addressVal$delegate, MutableState $customerAddress$delegate, MutableState $showCustomerDialog$delegate) {
        $customerPhone$delegate.setValue(BillingScreen$lambda$140$0$14$0$0$1($phoneVal$delegate));
        $customerName$delegate.setValue(BillingScreen$lambda$140$0$14$0$0$4($nameVal$delegate));
        $customerAddress$delegate.setValue(BillingScreen$lambda$140$0$14$0$0$7($addressVal$delegate));
        BillingScreen$lambda$100($showCustomerDialog$delegate, false);
        Toast.makeText($context, "Customer Info Saved", 0).show();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$15$0(MutableState $showNoteDialog$delegate) {
        BillingScreen$lambda$103($showNoteDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$16(long $CardDark, final long $CardBorderDark, final MutableState $kotNote$delegate, final long $TextSecondary, final long $InputDark, final MutableState $showNoteDialog$delegate, final long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2597@174022L37,2600@174226L2806,2595@173911L3121:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1914088684, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2595)");
            }
            CardKt.Card(PaddingKt.padding-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(16)), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(16)), CardDefaults.INSTANCE.cardColors-ro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), (CardElevation) null, BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(1361647802, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda98
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$16$0;
                    BillingScreen$lambda$140$0$16$0 = BillingScreenKt.BillingScreen$lambda$140$0$16$0($CardBorderDark, $kotNote$delegate, $TextSecondary, $InputDark, $showNoteDialog$delegate, $TextPrimary, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$16$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:33:0x04fe, code lost:
    
        if (r7 != androidx.compose.runtime.Composer.Companion.getEmpty()) goto L45;
     */
    @androidx.compose.runtime.ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @androidx.compose.runtime.Composable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit BillingScreen$lambda$140$0$16$0(long r133, final androidx.compose.runtime.MutableState r135, final long r136, long r138, final androidx.compose.runtime.MutableState r140, final long r141, androidx.compose.foundation.layout.ColumnScope r143, androidx.compose.runtime.Composer r144, int r145) {
        /*
            Method dump skipped, instructions count: 1397
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen$lambda$140$0$16$0(long, androidx.compose.runtime.MutableState, long, long, androidx.compose.runtime.MutableState, long, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    private static final String BillingScreen$lambda$140$0$16$0$0$1(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$16$0$0$3$0(MutableState $noteVal$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $noteVal$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$16$0$0$4(long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2618@175089L61:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1771770838, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2618)");
            }
            TextKt.Text-Nvy7gAk("Order Note / Chef Instructions", (Modifier) null, $TextSecondary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$16$0$0$5$0$0(MutableState $showNoteDialog$delegate) {
        BillingScreen$lambda$103($showNoteDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$16$0$0$5$1(long $TextPrimary, RowScope $this$Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter($this$Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C2639@176324L35:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1808953776, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2639)");
            }
            TextKt.Text-Nvy7gAk("Cancel", (Modifier) null, $TextPrimary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$16$0$0$5$2$0(MutableState $noteVal$delegate, MutableState $kotNote$delegate, MutableState $showNoteDialog$delegate) {
        $kotNote$delegate.setValue(BillingScreen$lambda$140$0$16$0$0$1($noteVal$delegate));
        BillingScreen$lambda$103($showNoteDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$17$0(MutableState $showPreviewDialog$delegate) {
        BillingScreen$lambda$97($showPreviewDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$18(long $CardDark, long $CardBorderDark, final Map $billingItems, final Order $activeOrder, final MutableState $discountInput$delegate, final State $posSettings$delegate, final MutableState $orderType$delegate, final MutableState $serviceChargeInput$delegate, final MutableState $deliveryChargeInput$delegate, final MutableState $isComplimentaryOrder$delegate, final MutableState $advancePaidInput$delegate, final State $selectedTable$delegate, final MutableState $selectedWaiter$delegate, final MutableState $customerName$delegate, final MutableState $customerPhone$delegate, final MutableState $selectedDialCode$delegate, final MutableState $customerAddress$delegate, final long $InputDark, final BillingViewModel $billingViewModel, final MutableState $paymentMethod$delegate, final UserProfile $user, final MutableState $showPreviewDialog$delegate, final long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2661@177308L37,2664@177542L12578,2659@177198L12922:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1480125003, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2659)");
            }
            CardKt.Card(PaddingKt.padding-VpY3zN4(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(8), Dp.constructor-impl(16)), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8)), CardDefaults.INSTANCE.cardColors-ro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), (CardElevation) null, BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(927684121, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda3
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$18$0;
                    BillingScreen$lambda$140$0$18$0 = BillingScreenKt.BillingScreen$lambda$140$0$18$0($billingItems, $activeOrder, $discountInput$delegate, $posSettings$delegate, $orderType$delegate, $serviceChargeInput$delegate, $deliveryChargeInput$delegate, $isComplimentaryOrder$delegate, $advancePaidInput$delegate, $selectedTable$delegate, $selectedWaiter$delegate, $customerName$delegate, $customerPhone$delegate, $selectedDialCode$delegate, $customerAddress$delegate, $InputDark, $billingViewModel, $paymentMethod$delegate, $user, $showPreviewDialog$delegate, $TextPrimary, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$18$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:129:0x0646, code lost:
    
        if (kotlin.text.StringsKt.contains$default(r11, "QTY.", r13, 2, (java.lang.Object) null) == false) goto L126;
     */
    /* JADX WARN: Removed duplicated region for block: B:103:0x0cd3  */
    /* JADX WARN: Removed duplicated region for block: B:108:0x0c14  */
    /* JADX WARN: Removed duplicated region for block: B:109:0x0abe  */
    /* JADX WARN: Removed duplicated region for block: B:110:0x0a00  */
    /* JADX WARN: Removed duplicated region for block: B:111:0x0887  */
    /* JADX WARN: Removed duplicated region for block: B:112:0x074e  */
    /* JADX WARN: Removed duplicated region for block: B:113:0x0729  */
    /* JADX WARN: Removed duplicated region for block: B:133:0x06a1  */
    /* JADX WARN: Removed duplicated region for block: B:135:0x06a9  */
    /* JADX WARN: Removed duplicated region for block: B:138:0x06e8 A[SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:77:0x0726  */
    /* JADX WARN: Removed duplicated region for block: B:80:0x074b  */
    /* JADX WARN: Removed duplicated region for block: B:83:0x0875  */
    /* JADX WARN: Removed duplicated region for block: B:86:0x0881  */
    /* JADX WARN: Removed duplicated region for block: B:89:0x09f0  */
    /* JADX WARN: Removed duplicated region for block: B:92:0x09fc  */
    /* JADX WARN: Removed duplicated region for block: B:95:0x0aac  */
    /* JADX WARN: Removed duplicated region for block: B:98:0x0bd8  */
    @androidx.compose.runtime.ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @androidx.compose.runtime.Composable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit BillingScreen$lambda$140$0$18$0(final java.util.Map r140, final com.example.sasloopmanager.data.Order r141, androidx.compose.runtime.MutableState r142, androidx.compose.runtime.State r143, final androidx.compose.runtime.MutableState r144, androidx.compose.runtime.MutableState r145, androidx.compose.runtime.MutableState r146, androidx.compose.runtime.MutableState r147, final androidx.compose.runtime.MutableState r148, final androidx.compose.runtime.State r149, final androidx.compose.runtime.MutableState r150, final androidx.compose.runtime.MutableState r151, final androidx.compose.runtime.MutableState r152, final androidx.compose.runtime.MutableState r153, final androidx.compose.runtime.MutableState r154, long r155, final com.example.sasloopmanager.BillingViewModel r157, final androidx.compose.runtime.MutableState r158, final com.example.sasloopmanager.data.UserProfile r159, final androidx.compose.runtime.MutableState r160, final long r161, androidx.compose.foundation.layout.ColumnScope r163, androidx.compose.runtime.Composer r164, int r165) {
        /*
            Method dump skipped, instructions count: 3293
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen$lambda$140$0$18$0(java.util.Map, com.example.sasloopmanager.data.Order, androidx.compose.runtime.MutableState, androidx.compose.runtime.State, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.State, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, long, com.example.sasloopmanager.BillingViewModel, androidx.compose.runtime.MutableState, com.example.sasloopmanager.data.UserProfile, androidx.compose.runtime.MutableState, long, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$18$0$0$7$0$0(MutableState $showPreviewDialog$delegate) {
        BillingScreen$lambda$97($showPreviewDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$18$0$0$7$1(long $TextPrimary, RowScope $this$Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter($this$Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C2826@187684L34:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1374990095, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2826)");
            }
            TextKt.Text-Nvy7gAk("Close", (Modifier) null, $TextPrimary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$18$0$0$7$2$0(double $finalTotal, BillingViewModel $billingViewModel, Order $activeOrder, Map $billingItems, double $subtotal, double $discount, double $cgst, double $sgst, double $serviceCharge, double $deliveryCharge, UserProfile $user, MutableState $showPreviewDialog$delegate, MutableState $advancePaidInput$delegate, MutableState $customerName$delegate, MutableState $customerPhone$delegate, MutableState $selectedDialCode$delegate, MutableState $customerAddress$delegate, MutableState $orderType$delegate, State $selectedTable$delegate, MutableState $selectedWaiter$delegate, MutableState $paymentMethod$delegate) {
        String str;
        String str2;
        String username;
        BillingScreen$lambda$97($showPreviewDialog$delegate, false);
        Double doubleOrNull = StringsKt.toDoubleOrNull(BillingScreen$lambda$66($advancePaidInput$delegate));
        double advancePaid = doubleOrNull != null ? doubleOrNull.doubleValue() : 0.0d;
        double remainingBalance = RangesKt.coerceAtLeast($finalTotal - advancePaid, 0.0d);
        if ($activeOrder == null || (str = $activeOrder.getBillNo()) == null) {
            str = "NEW";
        }
        String str3 = str;
        String BillingScreen$lambda$39 = BillingScreen$lambda$39($customerName$delegate);
        String str4 = StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate)) ? "" : BillingScreen$lambda$117($selectedDialCode$delegate) + BillingScreen$lambda$42($customerPhone$delegate);
        String BillingScreen$lambda$45 = BillingScreen$lambda$45($customerAddress$delegate);
        String BillingScreen$lambda$48 = BillingScreen$lambda$48($orderType$delegate);
        TableItem BillingScreen$lambda$15 = BillingScreen$lambda$15($selectedTable$delegate);
        if (BillingScreen$lambda$15 == null || (str2 = BillingScreen$lambda$15.getTableName()) == null) {
            str2 = "Direct";
        }
        String str5 = str2;
        String BillingScreen$lambda$78 = BillingScreen$lambda$78($selectedWaiter$delegate);
        String BillingScreen$lambda$51 = BillingScreen$lambda$51($paymentMethod$delegate);
        if ($user == null || (username = $user.getName()) == null) {
            username = $user != null ? $user.getUsername() : null;
            if (username == null) {
                username = "admin";
            }
        }
        BillingViewModel.triggerBillPrint$default($billingViewModel, str3, BillingScreen$lambda$39, str4, BillingScreen$lambda$45, BillingScreen$lambda$48, $billingItems, $subtotal, $discount, $cgst, $sgst, $serviceCharge, $deliveryCharge, $finalTotal, str5, BillingScreen$lambda$78, advancePaid, remainingBalance, BillingScreen$lambda$51, username, (String) null, 0.0d, 1572864, (Object) null);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$19$0(MutableState $showHistoryDialog$delegate) {
        BillingScreen$lambda$94($showHistoryDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$20(long $CardDark, final long $CardBorderDark, final long $InputDark, final long $TextSecondary, final State $posSettings$delegate, final long $TextPrimary, final MutableState $customerPhone$delegate, final State $isLoading$delegate, final State $customerHistory$delegate, final MutableState $showHistoryDialog$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2870@190397L37,2873@190601L13376,2868@190286L13691:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1046161322, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2868)");
            }
            CardKt.Card(PaddingKt.padding-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(16)), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(16)), CardDefaults.INSTANCE.cardColors-ro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), (CardElevation) null, BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(493720440, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda65
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$20$0;
                    BillingScreen$lambda$140$0$20$0 = BillingScreenKt.BillingScreen$lambda$140$0$20$0($InputDark, $CardBorderDark, $TextSecondary, $posSettings$delegate, $TextPrimary, $customerPhone$delegate, $isLoading$delegate, $customerHistory$delegate, $showHistoryDialog$delegate, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$20$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$20$0(final long $InputDark, final long $CardBorderDark, final long $TextSecondary, final State $posSettings$delegate, final long $TextPrimary, MutableState $customerPhone$delegate, State $isLoading$delegate, State $customerHistory$delegate, final MutableState $showHistoryDialog$delegate, ColumnScope $this$Card, Composer $composer, int $changed) {
        Function0 function0;
        Composer composer;
        int i;
        Object obj;
        int i2;
        String str;
        Composer composer2;
        String str2;
        Composer composer3;
        Function0 function02;
        boolean z;
        String str3;
        Function0 function03;
        Intrinsics.checkNotNullParameter($this$Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C2874@190627L13328:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(493720440, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2874)");
            }
            Modifier modifier = PaddingKt.padding-3ABfNKs(Modifier.Companion, Dp.constructor-impl(16));
            Alignment.Horizontal centerHorizontally = Alignment.Companion.getCenterHorizontally();
            Arrangement.Vertical vertical = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(12));
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(vertical, centerHorizontally, $composer, ((438 >> 3) & 14) | ((438 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i3 = ((((438 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer composer4 = Updater.constructor-impl($composer);
            Updater.set-impl(composer4, columnMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer4, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer4, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer4, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer4, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i4 = (i3 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope = ColumnScopeInstance.INSTANCE;
            int i5 = ((438 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -513497111, "C2879@190913L275,2886@191236L30,2893@191612L769,2888@191296L1085,3053@203692L40,3052@203605L29,3055@203831L98,3051@203555L374:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk("Customer History - " + BillingScreen$lambda$42($customerPhone$delegate), (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(16), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597824, 0, 262058);
            ComposerKt.sourceInformationMarkerStart($composer, 1091811584, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue = $composer.rememberedValue();
            if (rememberedValue == Composer.Companion.getEmpty()) {
                rememberedValue = SnapshotStateKt.mutableStateOf$default(0, (SnapshotMutationPolicy) null, 2, (Object) null);
                $composer.updateRememberedValue(rememberedValue);
            }
            final MutableState mutableState = (MutableState) rememberedValue;
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabRowKt.TabRow-pAZo6Ak(BillingScreen$lambda$140$0$20$0$0$1(mutableState), ClipKt.clip(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8))), $InputDark, ColorKt.getSaSGreen(), (Function3) null, (Function2) null, ComposableLambdaKt.rememberComposableLambda(-168477526, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda54
                public final Object invoke(Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$20$0$0$3;
                    BillingScreen$lambda$140$0$20$0$0$3 = BillingScreenKt.BillingScreen$lambda$140$0$20$0$0$3(mutableState, $TextSecondary, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$20$0$0$3;
                }
            }, $composer, 54), $composer, 1572864, 48);
            if (BillingScreen$lambda$16($isLoading$delegate)) {
                $composer.startReplaceGroup(-512388025);
                ComposerKt.sourceInformation($composer, "2907@192460L313");
                Modifier modifier2 = SizeKt.height-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(160));
                Alignment center = Alignment.Companion.getCenter();
                ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
                ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                CompositionLocalMap currentCompositionLocalMap2 = $composer.getCurrentCompositionLocalMap();
                Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer, modifier2);
                Function0 constructor2 = ComposeUiNode.Companion.getConstructor();
                int i6 = ((((54 << 3) & 112) << 6) & 896) | 6;
                ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                if (!($composer.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                $composer.startReusableNode();
                if ($composer.getInserting()) {
                    $composer.createNode(constructor2);
                } else {
                    $composer.useNode();
                }
                Composer composer5 = Updater.constructor-impl($composer);
                Updater.set-impl(composer5, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
                Updater.set-impl(composer5, currentCompositionLocalMap2, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                Updater.init-impl(composer5, Integer.valueOf(hashCode2), ComposeUiNode.Companion.getSetCompositeKeyHash());
                Updater.reconcile-impl(composer5, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                Updater.set-impl(composer5, materializeModifier2, ComposeUiNode.Companion.getSetModifier());
                int i7 = (i6 >> 6) & 14;
                ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                BoxScope boxScope = BoxScopeInstance.INSTANCE;
                int i8 = ((54 >> 6) & 112) | 6;
                ComposerKt.sourceInformationMarkerStart($composer, -1730913641, "C2911@192696L43:BillingScreen.kt#7ez3px");
                ProgressIndicatorKt.CircularProgressIndicator-4lLiAd8((Modifier) null, ColorKt.getSaSGreen(), 0.0f, 0L, 0, 0.0f, $composer, 0, 61);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                $composer.endNode();
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                $composer.endReplaceGroup();
                composer2 = $composer;
                i = 54;
                str = "CC(remember):BillingScreen.kt#9igjgp";
            } else {
                $composer.startReplaceGroup(-511687580);
                ComposerKt.sourceInformation($composer, "");
                CustomerHistoryResponse BillingScreen$lambda$11 = BillingScreen$lambda$11($customerHistory$delegate);
                if (BillingScreen$lambda$11 != null) {
                    List orders = BillingScreen$lambda$11.getOrders();
                    if (orders == null || orders.isEmpty()) {
                        List transactions = BillingScreen$lambda$11.getTransactions();
                        if (transactions == null || transactions.isEmpty()) {
                            composer = $composer;
                            i = 54;
                            obj = null;
                            i2 = 1;
                        }
                    }
                    $composer.startReplaceGroup(-511075392);
                    ComposerKt.sourceInformation($composer, "");
                    if (BillingScreen$lambda$140$0$20$0$0$1(mutableState) == 0) {
                        $composer.startReplaceGroup(-511179490);
                        ComposerKt.sourceInformation($composer, "");
                        List orders2 = BillingScreen$lambda$11.getOrders();
                        if (orders2 == null) {
                            orders2 = CollectionsKt.emptyList();
                        }
                        if (orders2.isEmpty()) {
                            $composer.startReplaceGroup(-511167245);
                            ComposerKt.sourceInformation($composer, "2926@193699L405");
                            Modifier modifier3 = SizeKt.height-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(160));
                            Alignment center2 = Alignment.Companion.getCenter();
                            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                            MeasurePolicy maybeCachedBoxMeasurePolicy2 = BoxKt.maybeCachedBoxMeasurePolicy(center2, false);
                            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                            int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                            CompositionLocalMap currentCompositionLocalMap3 = $composer.getCurrentCompositionLocalMap();
                            Modifier materializeModifier3 = ComposedModifierKt.materializeModifier($composer, modifier3);
                            Function0 constructor3 = ComposeUiNode.Companion.getConstructor();
                            int i9 = ((((54 << 3) & 112) << 6) & 896) | 6;
                            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                            if (!($composer.getApplier() instanceof Applier)) {
                                ComposablesKt.invalidApplier();
                            }
                            $composer.startReusableNode();
                            if ($composer.getInserting()) {
                                function03 = constructor3;
                                $composer.createNode(function03);
                            } else {
                                function03 = constructor3;
                                $composer.useNode();
                            }
                            Composer composer6 = Updater.constructor-impl($composer);
                            Updater.set-impl(composer6, maybeCachedBoxMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
                            Updater.set-impl(composer6, currentCompositionLocalMap3, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                            Updater.init-impl(composer6, Integer.valueOf(hashCode3), ComposeUiNode.Companion.getSetCompositeKeyHash());
                            Updater.reconcile-impl(composer6, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                            Updater.set-impl(composer6, materializeModifier3, ComposeUiNode.Companion.getSetModifier());
                            int i10 = (i9 >> 6) & 14;
                            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                            BoxScope boxScope2 = BoxScopeInstance.INSTANCE;
                            int i11 = ((54 >> 6) & 112) | 6;
                            ComposerKt.sourceInformationMarkerStart($composer, 930778778, "C2930@193983L75:BillingScreen.kt#7ez3px");
                            i = 54;
                            z = true;
                            TextKt.Text-Nvy7gAk("No past orders", (Modifier) null, $TextSecondary, (TextAutoSize) null, 0L, FontStyle.box-impl(FontStyle.Companion.getItalic-_-LCdwA()), (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262106);
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            $composer.endNode();
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            $composer.endReplaceGroup();
                            composer3 = $composer;
                            str3 = "CC(remember):BillingScreen.kt#9igjgp";
                        } else {
                            i = 54;
                            z = true;
                            $composer.startReplaceGroup(-510559862);
                            ComposerKt.sourceInformation($composer, "2936@194460L3768,2933@194198L4030");
                            Modifier modifier4 = SizeKt.heightIn-VpY3zN4$default(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), 0.0f, Dp.constructor-impl(240), 1, (Object) null);
                            Arrangement.Vertical vertical2 = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(8));
                            str3 = "CC(remember):BillingScreen.kt#9igjgp";
                            ComposerKt.sourceInformationMarkerStart($composer, 1091918490, str3);
                            boolean changedInstance = $composer.changedInstance(orders2) | $composer.changed($InputDark) | $composer.changed($CardBorderDark) | $composer.changed($TextSecondary) | $composer.changed($posSettings$delegate) | $composer.changed($TextPrimary);
                            Object rememberedValue2 = $composer.rememberedValue();
                            if (changedInstance || rememberedValue2 == Composer.Companion.getEmpty()) {
                                final List list = orders2;
                                rememberedValue2 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda55
                                    public final Object invoke(Object obj2) {
                                        Unit BillingScreen$lambda$140$0$20$0$0$7$0;
                                        BillingScreen$lambda$140$0$20$0$0$7$0 = BillingScreenKt.BillingScreen$lambda$140$0$20$0$0$7$0(list, $InputDark, $CardBorderDark, $TextSecondary, $TextPrimary, $posSettings$delegate, (LazyListScope) obj2);
                                        return BillingScreen$lambda$140$0$20$0$0$7$0;
                                    }
                                };
                                $composer.updateRememberedValue(rememberedValue2);
                            }
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            LazyDslKt.LazyColumn(modifier4, (LazyListState) null, (PaddingValues) null, false, vertical2, (Alignment.Horizontal) null, (FlingBehavior) null, false, (OverscrollEffect) null, (Function1) rememberedValue2, $composer, 24582, 494);
                            composer3 = $composer;
                            composer3.endReplaceGroup();
                        }
                        composer3.endReplaceGroup();
                        str2 = str3;
                    } else {
                        i = 54;
                        $composer.startReplaceGroup(-506399259);
                        ComposerKt.sourceInformation($composer, "");
                        List transactions2 = BillingScreen$lambda$11.getTransactions();
                        if (transactions2 == null) {
                            transactions2 = CollectionsKt.emptyList();
                        }
                        if (transactions2.isEmpty()) {
                            $composer.startReplaceGroup(-506397461);
                            ComposerKt.sourceInformation($composer, "2986@198507L413");
                            Modifier modifier5 = SizeKt.height-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(160));
                            Alignment center3 = Alignment.Companion.getCenter();
                            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                            MeasurePolicy maybeCachedBoxMeasurePolicy3 = BoxKt.maybeCachedBoxMeasurePolicy(center3, false);
                            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                            int hashCode4 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                            CompositionLocalMap currentCompositionLocalMap4 = $composer.getCurrentCompositionLocalMap();
                            Modifier materializeModifier4 = ComposedModifierKt.materializeModifier($composer, modifier5);
                            Function0 constructor4 = ComposeUiNode.Companion.getConstructor();
                            int i12 = ((((54 << 3) & 112) << 6) & 896) | 6;
                            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                            if (!($composer.getApplier() instanceof Applier)) {
                                ComposablesKt.invalidApplier();
                            }
                            $composer.startReusableNode();
                            if ($composer.getInserting()) {
                                function02 = constructor4;
                                $composer.createNode(function02);
                            } else {
                                function02 = constructor4;
                                $composer.useNode();
                            }
                            Composer composer7 = Updater.constructor-impl($composer);
                            Updater.set-impl(composer7, maybeCachedBoxMeasurePolicy3, ComposeUiNode.Companion.getSetMeasurePolicy());
                            Updater.set-impl(composer7, currentCompositionLocalMap4, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                            Updater.init-impl(composer7, Integer.valueOf(hashCode4), ComposeUiNode.Companion.getSetCompositeKeyHash());
                            Updater.reconcile-impl(composer7, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                            Updater.set-impl(composer7, materializeModifier4, ComposeUiNode.Companion.getSetModifier());
                            int i13 = (i12 >> 6) & 14;
                            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                            BoxScope boxScope3 = BoxScopeInstance.INSTANCE;
                            int i14 = ((54 >> 6) & 112) | 6;
                            ComposerKt.sourceInformationMarkerStart($composer, 326973915, "C2990@198791L83:BillingScreen.kt#7ez3px");
                            TextKt.Text-Nvy7gAk("No ledger transactions", (Modifier) null, $TextSecondary, (TextAutoSize) null, 0L, FontStyle.box-impl(FontStyle.Companion.getItalic-_-LCdwA()), (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262106);
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            $composer.endNode();
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            $composer.endReplaceGroup();
                            composer3 = $composer;
                            str2 = "CC(remember):BillingScreen.kt#9igjgp";
                        } else {
                            final List list2 = transactions2;
                            $composer.startReplaceGroup(-505771943);
                            ComposerKt.sourceInformation($composer, "2996@199276L4105,2993@199014L4367");
                            Modifier modifier6 = SizeKt.heightIn-VpY3zN4$default(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), 0.0f, Dp.constructor-impl(240), 1, (Object) null);
                            Arrangement.Vertical vertical3 = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(8));
                            str2 = "CC(remember):BillingScreen.kt#9igjgp";
                            ComposerKt.sourceInformationMarkerStart($composer, 1092072939, str2);
                            boolean changedInstance2 = $composer.changedInstance(list2) | $composer.changed($InputDark) | $composer.changed($CardBorderDark) | $composer.changed($TextSecondary) | $composer.changed($posSettings$delegate) | $composer.changed($TextPrimary);
                            Object rememberedValue3 = $composer.rememberedValue();
                            if (changedInstance2 || rememberedValue3 == Composer.Companion.getEmpty()) {
                                rememberedValue3 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda56
                                    public final Object invoke(Object obj2) {
                                        Unit BillingScreen$lambda$140$0$20$0$0$9$0;
                                        BillingScreen$lambda$140$0$20$0$0$9$0 = BillingScreenKt.BillingScreen$lambda$140$0$20$0$0$9$0(list2, $InputDark, $CardBorderDark, $TextPrimary, $TextSecondary, $posSettings$delegate, (LazyListScope) obj2);
                                        return BillingScreen$lambda$140$0$20$0$0$9$0;
                                    }
                                };
                                $composer.updateRememberedValue(rememberedValue3);
                            }
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            LazyDslKt.LazyColumn(modifier6, (LazyListState) null, (PaddingValues) null, false, vertical3, (Alignment.Horizontal) null, (FlingBehavior) null, false, (OverscrollEffect) null, (Function1) rememberedValue3, $composer, 24582, 494);
                            composer3 = $composer;
                            composer3.endReplaceGroup();
                        }
                        composer3.endReplaceGroup();
                    }
                    composer3.endReplaceGroup();
                    composer2 = composer3;
                    str = str2;
                    composer2.endReplaceGroup();
                } else {
                    composer = $composer;
                    i = 54;
                    obj = null;
                    i2 = 1;
                }
                composer.startReplaceGroup(-511814711);
                ComposerKt.sourceInformation(composer, "2916@193040L367");
                Modifier modifier7 = SizeKt.height-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, i2, obj), Dp.constructor-impl(160));
                Alignment center4 = Alignment.Companion.getCenter();
                int i15 = i;
                Composer composer8 = composer;
                ComposerKt.sourceInformationMarkerStart(composer8, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                MeasurePolicy maybeCachedBoxMeasurePolicy4 = BoxKt.maybeCachedBoxMeasurePolicy(center4, false);
                ComposerKt.sourceInformationMarkerStart(composer8, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                int hashCode5 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer8, 0));
                CompositionLocalMap currentCompositionLocalMap5 = composer8.getCurrentCompositionLocalMap();
                Modifier materializeModifier5 = ComposedModifierKt.materializeModifier(composer8, modifier7);
                Function0 constructor5 = ComposeUiNode.Companion.getConstructor();
                int i16 = ((((i15 << 3) & 112) << 6) & 896) | 6;
                ComposerKt.sourceInformationMarkerStart(composer8, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                if (!(composer8.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                composer8.startReusableNode();
                if (composer8.getInserting()) {
                    composer8.createNode(constructor5);
                } else {
                    composer8.useNode();
                }
                Composer composer9 = Updater.constructor-impl(composer8);
                Updater.set-impl(composer9, maybeCachedBoxMeasurePolicy4, ComposeUiNode.Companion.getSetMeasurePolicy());
                Updater.set-impl(composer9, currentCompositionLocalMap5, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                Updater.init-impl(composer9, Integer.valueOf(hashCode5), ComposeUiNode.Companion.getSetCompositeKeyHash());
                Updater.reconcile-impl(composer9, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                Updater.set-impl(composer9, materializeModifier5, ComposeUiNode.Companion.getSetModifier());
                int i17 = (i16 >> 6) & 14;
                ComposerKt.sourceInformationMarkerStart(composer8, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                BoxScope boxScope4 = BoxScopeInstance.INSTANCE;
                int i18 = ((i15 >> 6) & 112) | 6;
                ComposerKt.sourceInformationMarkerStart(composer8, 638640345, "C2920@193292L77:BillingScreen.kt#7ez3px");
                composer2 = composer;
                str = "CC(remember):BillingScreen.kt#9igjgp";
                TextKt.Text-Nvy7gAk("No history found", (Modifier) null, $TextSecondary, (TextAutoSize) null, 0L, FontStyle.box-impl(FontStyle.Companion.getItalic-_-LCdwA()), (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, composer8, 6, 0, 262106);
                ComposerKt.sourceInformationMarkerEnd(composer8);
                ComposerKt.sourceInformationMarkerEnd(composer8);
                composer8.endNode();
                ComposerKt.sourceInformationMarkerEnd(composer8);
                ComposerKt.sourceInformationMarkerEnd(composer8);
                ComposerKt.sourceInformationMarkerEnd(composer8);
                composer2.endReplaceGroup();
                composer2.endReplaceGroup();
            }
            Composer composer10 = composer2;
            ButtonColors buttonColors = ButtonDefaults.INSTANCE.buttonColors-ro_MJ88($InputDark, 0L, 0L, 0L, composer10, ButtonDefaults.$stable << 12, 14);
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null);
            ComposerKt.sourceInformationMarkerStart(composer10, 1092207391, str);
            Object rememberedValue4 = composer10.rememberedValue();
            if (rememberedValue4 == Composer.Companion.getEmpty()) {
                Object obj2 = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda57
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$20$0$0$10$0;
                        BillingScreen$lambda$140$0$20$0$0$10$0 = BillingScreenKt.BillingScreen$lambda$140$0$20$0$0$10$0($showHistoryDialog$delegate);
                        return BillingScreen$lambda$140$0$20$0$0$10$0;
                    }
                };
                composer10.updateRememberedValue(obj2);
                rememberedValue4 = obj2;
            }
            ComposerKt.sourceInformationMarkerEnd(composer10);
            ButtonKt.Button((Function0) rememberedValue4, fillMaxWidth$default, false, (Shape) null, buttonColors, (ButtonElevation) null, (BorderStroke) null, (PaddingValues) null, (MutableInteractionSource) null, ComposableLambdaKt.rememberComposableLambda(709228370, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda58
                public final Object invoke(Object obj3, Object obj4, Object obj5) {
                    Unit BillingScreen$lambda$140$0$20$0$0$11;
                    BillingScreen$lambda$140$0$20$0$0$11 = BillingScreenKt.BillingScreen$lambda$140$0$20$0$0$11($TextPrimary, (RowScope) obj3, (Composer) obj4, ((Integer) obj5).intValue());
                    return BillingScreen$lambda$140$0$20$0$0$11;
                }
            }, composer10, i), composer10, 805306422, 492);
            ComposerKt.sourceInformationMarkerEnd(composer10);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    private static final int BillingScreen$lambda$140$0$20$0$0$1(MutableState<Integer> mutableState) {
        return ((Number) ((State) mutableState).getValue()).intValue();
    }

    private static final void BillingScreen$lambda$140$0$20$0$0$2(MutableState<Integer> mutableState, int i) {
        mutableState.setValue(Integer.valueOf(i));
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$20$0$0$3(final MutableState $historyTab$delegate, final long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2896@191761L18,2897@191824L124,2894@191646L336,2901@192130L18,2902@192193L124,2899@192015L336:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-168477526, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2894)");
            }
            boolean z = BillingScreen$lambda$140$0$20$0$0$1($historyTab$delegate) == 0;
            ComposerKt.sourceInformationMarkerStart($composer, 1301859548, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue = $composer.rememberedValue();
            if (rememberedValue == Composer.Companion.getEmpty()) {
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda243
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$20$0$0$3$0$0;
                        BillingScreen$lambda$140$0$20$0$0$3$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$20$0$0$3$0$0($historyTab$delegate);
                        return BillingScreen$lambda$140$0$20$0$0$3$0$0;
                    }
                };
                $composer.updateRememberedValue(obj);
                rememberedValue = obj;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.Tab-wqdebIU(z, (Function0) rememberedValue, (Modifier) null, false, ComposableLambdaKt.rememberComposableLambda(331796356, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda244
                public final Object invoke(Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$20$0$0$3$1;
                    BillingScreen$lambda$140$0$20$0$0$3$1 = BillingScreenKt.BillingScreen$lambda$140$0$20$0$0$3$1($TextSecondary, $historyTab$delegate, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$20$0$0$3$1;
                }
            }, $composer, 54), (Function2) null, 0L, 0L, (MutableInteractionSource) null, $composer, 24624, 492);
            boolean z2 = BillingScreen$lambda$140$0$20$0$0$1($historyTab$delegate) == 1;
            ComposerKt.sourceInformationMarkerStart($composer, 1301871356, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue2 = $composer.rememberedValue();
            if (rememberedValue2 == Composer.Companion.getEmpty()) {
                Object obj2 = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda245
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$20$0$0$3$2$0;
                        BillingScreen$lambda$140$0$20$0$0$3$2$0 = BillingScreenKt.BillingScreen$lambda$140$0$20$0$0$3$2$0($historyTab$delegate);
                        return BillingScreen$lambda$140$0$20$0$0$3$2$0;
                    }
                };
                $composer.updateRememberedValue(obj2);
                rememberedValue2 = obj2;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.Tab-wqdebIU(z2, (Function0) rememberedValue2, (Modifier) null, false, ComposableLambdaKt.rememberComposableLambda(289811181, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda246
                public final Object invoke(Object obj3, Object obj4) {
                    Unit BillingScreen$lambda$140$0$20$0$0$3$3;
                    BillingScreen$lambda$140$0$20$0$0$3$3 = BillingScreenKt.BillingScreen$lambda$140$0$20$0$0$3$3($TextSecondary, $historyTab$delegate, (Composer) obj3, ((Integer) obj4).intValue());
                    return BillingScreen$lambda$140$0$20$0$0$3$3;
                }
            }, $composer, 54), (Function2) null, 0L, 0L, (MutableInteractionSource) null, $composer, 24624, 492);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$20$0$0$3$0$0(MutableState $historyTab$delegate) {
        BillingScreen$lambda$140$0$20$0$0$2($historyTab$delegate, 0);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$20$0$0$3$1(long $TextSecondary, MutableState $historyTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2897@191826L120:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(331796356, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2897)");
            }
            TextKt.Text-Nvy7gAk("Orders", (Modifier) null, BillingScreen$lambda$140$0$20$0$0$1($historyTab$delegate) == 0 ? ColorKt.getSaSGreen() : $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(12), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$20$0$0$3$2$0(MutableState $historyTab$delegate) {
        BillingScreen$lambda$140$0$20$0$0$2($historyTab$delegate, 1);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$20$0$0$3$3(long $TextSecondary, MutableState $historyTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2902@192195L120:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(289811181, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2902)");
            }
            TextKt.Text-Nvy7gAk("Ledger", (Modifier) null, BillingScreen$lambda$140$0$20$0$0$1($historyTab$delegate) == 1 ? ColorKt.getSaSGreen() : $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(12), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$20$0$0$7$0(List $orders, long $InputDark, long $CardBorderDark, long $TextSecondary, long $TextPrimary, State $posSettings$delegate, LazyListScope $this$LazyColumn) {
        Intrinsics.checkNotNullParameter($this$LazyColumn, "$this$LazyColumn");
        $this$LazyColumn.items($orders.size(), (Function1) null, new BillingScreenKt$BillingScreen$lambda$140$0$20$0$0$7$0$.inlined.items.default.3(BillingScreenKt$BillingScreen$lambda$140$0$20$0$0$7$0$.inlined.items.default.1.INSTANCE, $orders), ComposableLambdaKt.composableLambdaInstance(802480018, true, new BillingScreenKt$BillingScreen$lambda$140$0$20$0$0$7$0$.inlined.items.default.4($orders, $InputDark, $CardBorderDark, $TextSecondary, $TextPrimary, $posSettings$delegate)));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$20$0$0$9$0(List $txs, long $InputDark, long $CardBorderDark, long $TextPrimary, long $TextSecondary, State $posSettings$delegate, LazyListScope $this$LazyColumn) {
        Intrinsics.checkNotNullParameter($this$LazyColumn, "$this$LazyColumn");
        $this$LazyColumn.items($txs.size(), (Function1) null, new BillingScreenKt$BillingScreen$lambda$140$0$20$0$0$9$0$.inlined.items.default.3(BillingScreenKt$BillingScreen$lambda$140$0$20$0$0$9$0$.inlined.items.default.1.INSTANCE, $txs), ComposableLambdaKt.composableLambdaInstance(802480018, true, new BillingScreenKt$BillingScreen$lambda$140$0$20$0$0$9$0$.inlined.items.default.4($txs, $InputDark, $CardBorderDark, $TextPrimary, $TextSecondary, $posSettings$delegate)));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$20$0$0$10$0(MutableState $showHistoryDialog$delegate) {
        BillingScreen$lambda$94($showHistoryDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$20$0$0$11(long $TextPrimary, RowScope $this$Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter($this$Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C3056@203865L34:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(709228370, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3056)");
            }
            TextKt.Text-Nvy7gAk("Close", (Modifier) null, $TextPrimary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$21$0(MutableState $showPaymentDialog$delegate) {
        BillingScreen$lambda$106($showPaymentDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$22(long $CardDark, final long $CardBorderDark, final Map $billingItems, final MutableState $discountInput$delegate, final State $posSettings$delegate, final MutableState $orderType$delegate, final MutableState $serviceChargeInput$delegate, final MutableState $deliveryChargeInput$delegate, final MutableState $isComplimentaryOrder$delegate, final MutableState $advancePaidInput$delegate, final long $InputDark, final MutableState $paymentMethod$delegate, final BillingViewModel $billingViewModel, final MutableState $customerName$delegate, final MutableState $customerPhone$delegate, final MutableState $customerAddress$delegate, final MutableState $preOrderIdInput$delegate, final State $selectedTable$delegate, final MutableState $selectedWaiter$delegate, final UserProfile $user, final Context $context, final MutableState $showPaymentDialog$delegate, final long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3067@204254L37,3070@204458L8925,3065@204143L9240:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(612197641, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3065)");
            }
            CardKt.Card(PaddingKt.padding-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(16)), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(16)), CardDefaults.INSTANCE.cardColors-ro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), (CardElevation) null, BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(59756759, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda251
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$22$0;
                    BillingScreen$lambda$140$0$22$0 = BillingScreenKt.BillingScreen$lambda$140$0$22$0($billingItems, $discountInput$delegate, $posSettings$delegate, $orderType$delegate, $serviceChargeInput$delegate, $deliveryChargeInput$delegate, $isComplimentaryOrder$delegate, $advancePaidInput$delegate, $InputDark, $CardBorderDark, $paymentMethod$delegate, $billingViewModel, $customerName$delegate, $customerPhone$delegate, $customerAddress$delegate, $preOrderIdInput$delegate, $selectedTable$delegate, $selectedWaiter$delegate, $user, $context, $showPaymentDialog$delegate, $TextPrimary, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$22$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Removed duplicated region for block: B:120:0x0b10  */
    /* JADX WARN: Removed duplicated region for block: B:123:0x0b1c  */
    /* JADX WARN: Removed duplicated region for block: B:126:0x0bc8  */
    /* JADX WARN: Removed duplicated region for block: B:134:0x0de0  */
    /* JADX WARN: Removed duplicated region for block: B:139:0x0bda  */
    /* JADX WARN: Removed duplicated region for block: B:140:0x0b20  */
    /* JADX WARN: Removed duplicated region for block: B:141:0x076c  */
    /* JADX WARN: Removed duplicated region for block: B:142:0x03cd  */
    /* JADX WARN: Removed duplicated region for block: B:143:0x02a7  */
    /* JADX WARN: Removed duplicated region for block: B:144:0x0294  */
    /* JADX WARN: Removed duplicated region for block: B:145:0x0281  */
    /* JADX WARN: Removed duplicated region for block: B:146:0x026e  */
    /* JADX WARN: Removed duplicated region for block: B:148:0x0244  */
    /* JADX WARN: Removed duplicated region for block: B:33:0x023f  */
    /* JADX WARN: Removed duplicated region for block: B:41:0x0269  */
    /* JADX WARN: Removed duplicated region for block: B:44:0x027e  */
    /* JADX WARN: Removed duplicated region for block: B:47:0x028f  */
    /* JADX WARN: Removed duplicated region for block: B:50:0x02a2  */
    /* JADX WARN: Removed duplicated region for block: B:53:0x03bb  */
    /* JADX WARN: Removed duplicated region for block: B:56:0x03c7  */
    /* JADX WARN: Removed duplicated region for block: B:60:0x0472  */
    /* JADX WARN: Removed duplicated region for block: B:83:0x06a2 A[EDGE_INSN: B:83:0x06a2->B:84:0x06a2 BREAK  A[LOOP:1: B:58:0x0468->B:77:0x05cd], SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:86:0x075a  */
    /* JADX WARN: Removed duplicated region for block: B:89:0x0766  */
    /* JADX WARN: Removed duplicated region for block: B:93:0x080d  */
    @androidx.compose.runtime.ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @androidx.compose.runtime.Composable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit BillingScreen$lambda$140$0$22$0(java.util.Map r160, androidx.compose.runtime.MutableState r161, androidx.compose.runtime.State r162, final androidx.compose.runtime.MutableState r163, androidx.compose.runtime.MutableState r164, androidx.compose.runtime.MutableState r165, androidx.compose.runtime.MutableState r166, androidx.compose.runtime.MutableState r167, long r168, long r170, final androidx.compose.runtime.MutableState r172, final com.example.sasloopmanager.BillingViewModel r173, final androidx.compose.runtime.MutableState r174, final androidx.compose.runtime.MutableState r175, final androidx.compose.runtime.MutableState r176, final androidx.compose.runtime.MutableState r177, final androidx.compose.runtime.State r178, final androidx.compose.runtime.MutableState r179, final com.example.sasloopmanager.data.UserProfile r180, final android.content.Context r181, final androidx.compose.runtime.MutableState r182, final long r183, androidx.compose.foundation.layout.ColumnScope r185, androidx.compose.runtime.Composer r186, int r187) {
        /*
            Method dump skipped, instructions count: 3562
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen$lambda$140$0$22$0(java.util.Map, androidx.compose.runtime.MutableState, androidx.compose.runtime.State, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, long, long, androidx.compose.runtime.MutableState, com.example.sasloopmanager.BillingViewModel, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.State, androidx.compose.runtime.MutableState, com.example.sasloopmanager.data.UserProfile, android.content.Context, androidx.compose.runtime.MutableState, long, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$22$0$0$1$0$0$0(String $method, MutableState $paymentMethod$delegate) {
        $paymentMethod$delegate.setValue($method);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$22$0$0$2$0$0$0(String $method, MutableState $paymentMethod$delegate) {
        $paymentMethod$delegate.setValue($method);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$22$0$0$3$0$0(MutableState $showPaymentDialog$delegate) {
        BillingScreen$lambda$106($showPaymentDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$22$0$0$3$1(long $TextPrimary, RowScope $this$Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter($this$Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C3177@210878L35:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-2043946411, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3177)");
            }
            TextKt.Text-Nvy7gAk("Cancel", (Modifier) null, $TextPrimary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$22$0$0$3$2$0(BillingViewModel $billingViewModel, double $discount, double $serviceCharge, double $deliveryCharge, double $cgst, double $sgst, double $advancePaid, double $remainingBalance, UserProfile $user, MutableState $showPaymentDialog$delegate, MutableState $customerName$delegate, MutableState $customerPhone$delegate, MutableState $customerAddress$delegate, final MutableState $paymentMethod$delegate, MutableState $orderType$delegate, MutableState $preOrderIdInput$delegate, State $selectedTable$delegate, MutableState $selectedWaiter$delegate, final Context $context) {
        String str;
        String str2;
        String str3;
        BillingScreen$lambda$106($showPaymentDialog$delegate, false);
        String BillingScreen$lambda$39 = BillingScreen$lambda$39($customerName$delegate);
        String BillingScreen$lambda$42 = BillingScreen$lambda$42($customerPhone$delegate);
        String BillingScreen$lambda$45 = BillingScreen$lambda$45($customerAddress$delegate);
        String BillingScreen$lambda$51 = BillingScreen$lambda$51($paymentMethod$delegate);
        String BillingScreen$lambda$48 = BillingScreen$lambda$48($orderType$delegate);
        String BillingScreen$lambda$63 = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? BillingScreen$lambda$63($preOrderIdInput$delegate) : null;
        Double valueOf = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? Double.valueOf($advancePaid) : null;
        Double valueOf2 = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? Double.valueOf($remainingBalance) : null;
        TableItem BillingScreen$lambda$15 = BillingScreen$lambda$15($selectedTable$delegate);
        if (BillingScreen$lambda$15 == null || (str = BillingScreen$lambda$15.getTableName()) == null) {
            str = "Direct";
        }
        String str4 = str;
        String BillingScreen$lambda$78 = BillingScreen$lambda$78($selectedWaiter$delegate);
        if ($user == null || (str3 = $user.getName()) == null) {
            String username = $user != null ? $user.getUsername() : null;
            if (username != null) {
                str2 = username;
                BillingViewModel.settleOrder$default($billingViewModel, BillingScreen$lambda$39, BillingScreen$lambda$42, BillingScreen$lambda$45, BillingScreen$lambda$51, BillingScreen$lambda$48, $discount, $serviceCharge, $deliveryCharge, $cgst, $sgst, BillingScreen$lambda$63, valueOf, valueOf2, str4, BillingScreen$lambda$78, false, "SETTLE", str2, (String) null, 0.0d, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda66
                    public final Object invoke(Object obj) {
                        Unit BillingScreen$lambda$140$0$22$0$0$3$2$0$0;
                        BillingScreen$lambda$140$0$22$0$0$3$2$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$22$0$0$3$2$0$0($context, $paymentMethod$delegate, ((Boolean) obj).booleanValue());
                        return BillingScreen$lambda$140$0$22$0$0$3$2$0$0;
                    }
                }, 786432, (Object) null);
                return Unit.INSTANCE;
            }
            str3 = "admin";
        }
        str2 = str3;
        BillingViewModel.settleOrder$default($billingViewModel, BillingScreen$lambda$39, BillingScreen$lambda$42, BillingScreen$lambda$45, BillingScreen$lambda$51, BillingScreen$lambda$48, $discount, $serviceCharge, $deliveryCharge, $cgst, $sgst, BillingScreen$lambda$63, valueOf, valueOf2, str4, BillingScreen$lambda$78, false, "SETTLE", str2, (String) null, 0.0d, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda66
            public final Object invoke(Object obj) {
                Unit BillingScreen$lambda$140$0$22$0$0$3$2$0$0;
                BillingScreen$lambda$140$0$22$0$0$3$2$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$22$0$0$3$2$0$0($context, $paymentMethod$delegate, ((Boolean) obj).booleanValue());
                return BillingScreen$lambda$140$0$22$0$0$3$2$0$0;
            }
        }, 786432, (Object) null);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$22$0$0$3$2$0$0(Context $context, MutableState $paymentMethod$delegate, boolean success) {
        if (success) {
            Toast.makeText($context, "Settle via " + BillingScreen$lambda$51($paymentMethod$delegate) + " Successful", 0).show();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$23$0(MutableState $selectedItemForModifiers$delegate) {
        $selectedItemForModifiers$delegate.setValue(null);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$24$0(BillingViewModel $billingViewModel, MenuItem $itemForModifiers, MutableState $selectedItemForModifiers$delegate, List selected, String note) {
        Intrinsics.checkNotNullParameter(selected, "selected");
        Intrinsics.checkNotNullParameter(note, "note");
        $billingViewModel.addCustomItemToCart($itemForModifiers, selected, note);
        $selectedItemForModifiers$delegate.setValue(null);
        return Unit.INSTANCE;
    }

    private static final boolean BillingScreen$lambda$140$0$28(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final void BillingScreen$lambda$140$0$29(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$30$0(SnapshotStateMap $selectedOldKotItems, SnapshotStateMap $oldKotItemReasons, MutableState $showOldKotDialog$delegate, MutableState $selectAllOldKot$delegate) {
        BillingScreen$lambda$109($showOldKotDialog$delegate, false);
        $selectedOldKotItems.clear();
        $oldKotItemReasons.clear();
        BillingScreen$lambda$140$0$29($selectAllOldKot$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$31(final long $dkBg, final long $dkBorder, final long $dkHeader, final List $oldKotEntries, final BillingViewModel $billingViewModel, final State $posSettings$delegate, final long $dkTextPrimary, final SnapshotStateMap $selectedOldKotItems, final SnapshotStateMap $oldKotItemReasons, final MutableState $showOldKotDialog$delegate, final MutableState $selectAllOldKot$delegate, final long $dkTextSecondary, final long $dkInput, final Context $context, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3254@215145L33,3259@215396L15114,3252@215034L15476:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-255729721, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3252)");
            }
            CardKt.Card(PaddingKt.padding-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(8)), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(16)), CardDefaults.INSTANCE.cardColors-ro_MJ88($dkBg, 0L, 0L, 0L, $composer, (CardDefaults.$stable << 12) | 6, 14), (CardElevation) null, BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), $dkBorder), ComposableLambdaKt.rememberComposableLambda(-808170603, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda33
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$31$0;
                    BillingScreen$lambda$140$0$31$0 = BillingScreenKt.BillingScreen$lambda$140$0$31$0($dkHeader, $dkBg, $dkBorder, $oldKotEntries, $billingViewModel, $posSettings$delegate, $dkTextPrimary, $selectedOldKotItems, $oldKotItemReasons, $showOldKotDialog$delegate, $selectAllOldKot$delegate, $dkTextSecondary, $dkInput, $context, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$31$0;
                }
            }, $composer, 54), $composer, 221190, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Removed duplicated region for block: B:105:0x082f  */
    /* JADX WARN: Removed duplicated region for block: B:107:0x05b6  */
    /* JADX WARN: Removed duplicated region for block: B:37:0x05a4  */
    /* JADX WARN: Removed duplicated region for block: B:40:0x05b0  */
    /* JADX WARN: Removed duplicated region for block: B:47:0x081d  */
    /* JADX WARN: Removed duplicated region for block: B:50:0x0829  */
    /* JADX WARN: Removed duplicated region for block: B:53:0x09a6  */
    /* JADX WARN: Removed duplicated region for block: B:62:0x0c82  */
    /* JADX WARN: Removed duplicated region for block: B:65:0x0c8e  */
    /* JADX WARN: Removed duplicated region for block: B:68:0x0d94  */
    /* JADX WARN: Removed duplicated region for block: B:71:0x0da0  */
    /* JADX WARN: Removed duplicated region for block: B:74:0x0e4c  */
    /* JADX WARN: Removed duplicated region for block: B:79:0x0f12  */
    /* JADX WARN: Removed duplicated region for block: B:84:0x0fee  */
    /* JADX WARN: Removed duplicated region for block: B:87:0x105f  */
    /* JADX WARN: Removed duplicated region for block: B:91:0x1000  */
    /* JADX WARN: Removed duplicated region for block: B:94:0x0e6d  */
    /* JADX WARN: Removed duplicated region for block: B:95:0x0da6  */
    /* JADX WARN: Removed duplicated region for block: B:96:0x0c94  */
    /* JADX WARN: Removed duplicated region for block: B:98:0x0b1d  */
    @androidx.compose.runtime.ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @androidx.compose.runtime.Composable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit BillingScreen$lambda$140$0$31$0(final long r147, long r149, final long r151, final java.util.List r153, final com.example.sasloopmanager.BillingViewModel r154, final androidx.compose.runtime.State r155, long r156, final androidx.compose.runtime.snapshots.SnapshotStateMap r158, final androidx.compose.runtime.snapshots.SnapshotStateMap r159, final androidx.compose.runtime.MutableState r160, final androidx.compose.runtime.MutableState r161, final long r162, final long r164, android.content.Context r166, androidx.compose.foundation.layout.ColumnScope r167, androidx.compose.runtime.Composer r168, int r169) {
        /*
            Method dump skipped, instructions count: 4207
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen$lambda$140$0$31$0(long, long, long, java.util.List, com.example.sasloopmanager.BillingViewModel, androidx.compose.runtime.State, long, androidx.compose.runtime.snapshots.SnapshotStateMap, androidx.compose.runtime.snapshots.SnapshotStateMap, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, long, long, android.content.Context, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$31$0$0$0$0$0(SnapshotStateMap $selectedOldKotItems, SnapshotStateMap $oldKotItemReasons, MutableState $showOldKotDialog$delegate, MutableState $selectAllOldKot$delegate) {
        BillingScreen$lambda$109($showOldKotDialog$delegate, false);
        $selectedOldKotItems.clear();
        $oldKotItemReasons.clear();
        BillingScreen$lambda$140$0$29($selectAllOldKot$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$31$0$0$0$1(long $dkTextSecondary, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C3281@216687L173:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-575420992, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3281)");
            }
            Alignment center = Alignment.Companion.getCenter();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            Modifier modifier = Modifier.Companion;
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = ((((48 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i3 = ((48 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 629099017, "C3282@216770L52:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk("✕", (Modifier) null, $dkTextSecondary, (TextAutoSize) null, TextUnitKt.getSp(14), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 24966, 0, 262122);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$31$0$0$1$0$0(List $oldKotEntries, MutableState $selectAllOldKot$delegate, SnapshotStateMap $selectedOldKotItems) {
        boolean newVal = !BillingScreen$lambda$140$0$28($selectAllOldKot$delegate);
        BillingScreen$lambda$140$0$29($selectAllOldKot$delegate, newVal);
        int i = 0;
        for (Object obj : $oldKotEntries) {
            int i2 = i + 1;
            if (i < 0) {
                CollectionsKt.throwIndexOverflow();
            }
            ((Map) $selectedOldKotItems).put(Integer.valueOf(i), Boolean.valueOf(newVal));
            i = i2;
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$31$0$0$1$1$0$0(List $oldKotEntries, MutableState $selectAllOldKot$delegate, SnapshotStateMap $selectedOldKotItems, boolean checked) {
        BillingScreen$lambda$140$0$29($selectAllOldKot$delegate, checked);
        int i = 0;
        for (Object obj : $oldKotEntries) {
            int i2 = i + 1;
            if (i < 0) {
                CollectionsKt.throwIndexOverflow();
            }
            ((Map) $selectedOldKotItems).put(Integer.valueOf(i), Boolean.valueOf(checked));
            i = i2;
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$31$0$0$4$0(final List $oldKotEntries, final SnapshotStateMap $selectedOldKotItems, final long $dkHeader, final long $dkBorder, final long $dkTextPrimary, final long $dkTextSecondary, final BillingViewModel $billingViewModel, final long $dkInput, final State $posSettings$delegate, final SnapshotStateMap $oldKotItemReasons, final MutableState $selectAllOldKot$delegate, LazyListScope $this$LazyColumn) {
        Intrinsics.checkNotNullParameter($this$LazyColumn, "$this$LazyColumn");
        LazyListScope.items$default($this$LazyColumn, $oldKotEntries.size(), (Function1) null, (Function1) null, ComposableLambdaKt.composableLambdaInstance(-2066659747, true, new Function4() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda68
            public final Object invoke(Object obj, Object obj2, Object obj3, Object obj4) {
                Unit BillingScreen$lambda$140$0$31$0$0$4$0$0;
                BillingScreen$lambda$140$0$31$0$0$4$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$31$0$0$4$0$0($oldKotEntries, $selectedOldKotItems, $dkHeader, $dkBorder, $dkTextPrimary, $dkTextSecondary, $billingViewModel, $dkInput, $posSettings$delegate, $oldKotItemReasons, $selectAllOldKot$delegate, (LazyItemScope) obj, ((Integer) obj2).intValue(), (Composer) obj3, ((Integer) obj4).intValue());
                return BillingScreen$lambda$140$0$31$0$0$4$0$0;
            }
        }), 6, (Object) null);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:77:0x08d1, code lost:
    
        if (r15 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L94;
     */
    /* JADX WARN: Removed duplicated region for block: B:105:0x0cf7  */
    /* JADX WARN: Removed duplicated region for block: B:110:0x0c2c  */
    /* JADX WARN: Removed duplicated region for block: B:112:0x0b03  */
    /* JADX WARN: Removed duplicated region for block: B:113:0x0a2b  */
    /* JADX WARN: Removed duplicated region for block: B:114:0x08d5  */
    /* JADX WARN: Removed duplicated region for block: B:76:0x08c9  */
    /* JADX WARN: Removed duplicated region for block: B:81:0x0a1b  */
    /* JADX WARN: Removed duplicated region for block: B:84:0x0a27  */
    /* JADX WARN: Removed duplicated region for block: B:87:0x0b01  */
    /* JADX WARN: Removed duplicated region for block: B:95:0x0b7b  */
    /* JADX WARN: Removed duplicated region for block: B:98:0x0c29  */
    @androidx.compose.runtime.ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @androidx.compose.runtime.Composable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit BillingScreen$lambda$140$0$31$0$0$4$0$0(final java.util.List r170, final androidx.compose.runtime.snapshots.SnapshotStateMap r171, long r172, long r174, long r176, final long r178, com.example.sasloopmanager.BillingViewModel r180, long r181, androidx.compose.runtime.State r183, androidx.compose.runtime.snapshots.SnapshotStateMap r184, final androidx.compose.runtime.MutableState r185, androidx.compose.foundation.lazy.LazyItemScope r186, int r187, androidx.compose.runtime.Composer r188, int r189) {
        /*
            Method dump skipped, instructions count: 3333
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen$lambda$140$0$31$0$0$4$0$0(java.util.List, androidx.compose.runtime.snapshots.SnapshotStateMap, long, long, long, long, com.example.sasloopmanager.BillingViewModel, long, androidx.compose.runtime.State, androidx.compose.runtime.snapshots.SnapshotStateMap, androidx.compose.runtime.MutableState, androidx.compose.foundation.lazy.LazyItemScope, int, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$31$0$0$4$0$0$1$0$1$0$0(BillingViewModel $billingViewModel, MenuItem $item, int $qty) {
        $billingViewModel.updateOldKotItemQty($item, RangesKt.coerceAtLeast($qty - 1, 1));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$31$0$0$4$0$0$1$0$1$1(long $dkTextSecondary, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C3362@223012L126:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-73905244, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3362)");
            }
            Alignment center = Alignment.Companion.getCenter();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            Modifier modifier = Modifier.Companion;
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = ((((48 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i3 = ((48 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 1508525864, "C3362@223055L81:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk("—", (Modifier) null, $dkTextSecondary, (TextAutoSize) null, TextUnitKt.getSp(9), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597830, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$31$0$0$4$0$0$1$0$1$2$0(BillingViewModel $billingViewModel, MenuItem $item, int $qty) {
        $billingViewModel.updateOldKotItemQty($item, $qty + 1);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$31$0$0$4$0$0$1$0$1$3(long $dkTextSecondary, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C3366@223687L127:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-488798707, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3366)");
            }
            Alignment center = Alignment.Companion.getCenter();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            Modifier modifier = Modifier.Companion;
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = ((((48 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i3 = ((48 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -2106818114, "C3366@223730L82:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk("+", (Modifier) null, $dkTextSecondary, (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597830, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$31$0$0$4$0$0$1$0$2$0$0(SnapshotStateMap $selectedOldKotItems, int $idx, List $oldKotEntries, MutableState $selectAllOldKot$delegate, boolean checked) {
        ((Map) $selectedOldKotItems).put(Integer.valueOf($idx), Boolean.valueOf(checked));
        Iterable indices = CollectionsKt.getIndices($oldKotEntries);
        boolean z = true;
        if (!(indices instanceof Collection) || !((Collection) indices).isEmpty()) {
            IntIterator it = indices.iterator();
            while (true) {
                if (!it.hasNext()) {
                    break;
                }
                if (!Intrinsics.areEqual($selectedOldKotItems.get(Integer.valueOf(it.nextInt())), true)) {
                    z = false;
                    break;
                }
            }
        }
        BillingScreen$lambda$140$0$29($selectAllOldKot$delegate, z);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$31$0$0$4$0$0$1$0$2$1$0(SnapshotStateMap $oldKotItemReasons, int $idx, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        ((Map) $oldKotItemReasons).put(Integer.valueOf($idx), it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @Composable
    @ComposableInferredTarget(scheme = "[androidx.compose.ui.UiComposable[androidx.compose.ui.UiComposable]]")
    public static final Unit BillingScreen$lambda$140$0$31$0$0$4$0$0$1$0$2$2(SnapshotStateMap $oldKotItemReasons, int $idx, long $dkTextSecondary, Function2 innerTextField, Composer $composer, int $changed) {
        Function0 function0;
        Intrinsics.checkNotNullParameter(innerTextField, "innerTextField");
        ComposerKt.sourceInformation($composer, "CN(innerTextField)3388@226110L380:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            $dirty |= $composer.changedInstance(innerTextField) ? 4 : 2;
        }
        if ($composer.shouldExecute(($dirty & 19) != 18, $dirty & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1021616871, $dirty, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3388)");
            }
            Alignment centerStart = Alignment.Companion.getCenterStart();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            Modifier modifier = Modifier.Companion;
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(centerStart, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int $dirty2 = $dirty;
            int i = ((((48 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i3 = ((48 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -130139390, "C3390@226412L16:BillingScreen.kt#7ez3px");
            String str = (String) $oldKotItemReasons.get(Integer.valueOf($idx));
            if (str == null) {
                str = "";
            }
            if (str.length() == 0) {
                $composer.startReplaceGroup(-130097696);
                ComposerKt.sourceInformation($composer, "3389@226270L75");
                TextKt.Text-Nvy7gAk("Reason", (Modifier) null, Color.copy-wmQWz5c$default($dkTextSecondary, 0.5f, 0.0f, 0.0f, 0.0f, 14, (Object) null), (TextAutoSize) null, TextUnitKt.getSp(8), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 24966, 0, 262122);
            } else {
                $composer.startReplaceGroup(-130021777);
            }
            $composer.endReplaceGroup();
            innerTextField.invoke($composer, Integer.valueOf($dirty2 & 14));
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$31$0$0$5$0$0$0(List $oldKotEntries, Context $context, BillingViewModel $billingViewModel, SnapshotStateMap $selectedOldKotItems, MutableState $selectAllOldKot$delegate) {
        List list = $oldKotEntries;
        int i = 0;
        Collection arrayList = new ArrayList();
        int i2 = 0;
        for (Object obj : list) {
            int i3 = i2 + 1;
            if (i2 < 0) {
                CollectionsKt.throwIndexOverflow();
            }
            Iterable iterable = list;
            int i4 = i;
            if (Intrinsics.areEqual($selectedOldKotItems.get(Integer.valueOf(i2)), true)) {
                arrayList.add(obj);
            }
            i2 = i3;
            list = iterable;
            i = i4;
        }
        Iterable iterable2 = (List) arrayList;
        Collection arrayList2 = new ArrayList(CollectionsKt.collectionSizeOrDefault(iterable2, 10));
        Iterator it = iterable2.iterator();
        while (it.hasNext()) {
            arrayList2.add((MenuItem) ((Map.Entry) it.next()).getKey());
        }
        Set selected = CollectionsKt.toSet((List) arrayList2);
        if (selected.isEmpty()) {
            Toast.makeText($context, "No items selected!", 0).show();
        } else {
            $billingViewModel.removeOldKotItems(selected);
            $selectedOldKotItems.clear();
            BillingScreen$lambda$140$0$29($selectAllOldKot$delegate, false);
            Toast.makeText($context, "Selected items deleted", 0).show();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$31$0$0$5$0$1(long $dkTextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3414@228174L155:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1497983491, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3414)");
            }
            TextKt.Text-Nvy7gAk("Delete KOT", PaddingKt.padding-VpY3zN4(Modifier.Companion, Dp.constructor-impl(10), Dp.constructor-impl(6)), $dkTextPrimary, (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597878, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$31$0$0$5$0$2$0(SnapshotStateMap $selectedOldKotItems, Context $context, BillingViewModel $billingViewModel, SnapshotStateMap $oldKotItemReasons, List $oldKotEntries, MutableState $selectAllOldKot$delegate) {
        SnapshotStateMap snapshotStateMap;
        boolean missingReason;
        Map linkedHashMap = new LinkedHashMap();
        for (Map.Entry entry : ((Map) $selectedOldKotItems).entrySet()) {
            if (((Boolean) entry.getValue()).booleanValue()) {
                linkedHashMap.put(entry.getKey(), entry.getValue());
            }
        }
        Set selectedIndices = linkedHashMap.keySet();
        if (selectedIndices.isEmpty()) {
            Toast.makeText($context, "No items selected!", 0).show();
        } else {
            Set set = selectedIndices;
            if (!(set instanceof Collection) || !set.isEmpty()) {
                Iterator it = set.iterator();
                while (true) {
                    if (it.hasNext()) {
                        snapshotStateMap = $oldKotItemReasons;
                        String str = (String) snapshotStateMap.get(Integer.valueOf(((Number) it.next()).intValue()));
                        if (str == null) {
                            str = "";
                        }
                        if (StringsKt.isBlank(str)) {
                            missingReason = true;
                            break;
                        }
                    } else {
                        snapshotStateMap = $oldKotItemReasons;
                        missingReason = false;
                        break;
                    }
                }
            } else {
                snapshotStateMap = $oldKotItemReasons;
                missingReason = false;
            }
            if (missingReason) {
                Toast.makeText($context, "Please provide a reason for all cancelled items!", 0).show();
            } else {
                Set set2 = selectedIndices;
                Collection arrayList = new ArrayList(CollectionsKt.collectionSizeOrDefault(set2, 10));
                Iterator it2 = set2.iterator();
                while (it2.hasNext()) {
                    arrayList.add((MenuItem) ((Map.Entry) $oldKotEntries.get(((Number) it2.next()).intValue())).getKey());
                }
                Set selected = CollectionsKt.toSet((List) arrayList);
                $billingViewModel.removeOldKotItems(selected);
                $selectedOldKotItems.clear();
                snapshotStateMap.clear();
                BillingScreen$lambda$140$0$29($selectAllOldKot$delegate, false);
                Toast.makeText($context, "Selected items cancelled", 0).show();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$31$0$0$5$0$3(long $dkTextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3425@229547L155:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(950382060, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3425)");
            }
            TextKt.Text-Nvy7gAk("Cancel KOT", PaddingKt.padding-VpY3zN4(Modifier.Companion, Dp.constructor-impl(10), Dp.constructor-impl(6)), $dkTextPrimary, (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597878, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$31$0$0$5$1$0(SnapshotStateMap $selectedOldKotItems, SnapshotStateMap $oldKotItemReasons, MutableState $showOldKotDialog$delegate, MutableState $selectAllOldKot$delegate) {
        BillingScreen$lambda$109($showOldKotDialog$delegate, false);
        $selectedOldKotItems.clear();
        $oldKotItemReasons.clear();
        BillingScreen$lambda$140$0$29($selectAllOldKot$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$33$0(MutableState $showSplitBillDialog$delegate) {
        BillingScreen$lambda$112($showSplitBillDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$34(final long $CardDark, long $CardBorderDark, final double $finalTotal, final long $InputDark, final Map $billingItems, final State $posSettings$delegate, final long $TextSecondary, final Context $context, final MutableState $showSplitBillDialog$delegate, final long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3467@231981L37,3470@232185L12469,3465@231870L12784:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-701510385, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3465)");
            }
            CardKt.Card(PaddingKt.padding-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(16)), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(16)), CardDefaults.INSTANCE.cardColors-ro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), (CardElevation) null, BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(-647308543, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda84
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$34$0;
                    BillingScreen$lambda$140$0$34$0 = BillingScreenKt.BillingScreen$lambda$140$0$34$0($finalTotal, $InputDark, $billingItems, $CardDark, $posSettings$delegate, $TextSecondary, $context, $showSplitBillDialog$delegate, $TextPrimary, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$34$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:44:0x05c5, code lost:
    
        if (r14 != androidx.compose.runtime.Composer.Companion.getEmpty()) goto L57;
     */
    /* JADX WARN: Code restructure failed: missing block: B:72:0x114d, code lost:
    
        if (r6 != androidx.compose.runtime.Composer.Companion.getEmpty()) goto L165;
     */
    /* JADX WARN: Removed duplicated region for block: B:118:0x0c46  */
    /* JADX WARN: Removed duplicated region for block: B:140:0x0ce0  */
    /* JADX WARN: Removed duplicated region for block: B:161:0x0e06  */
    /* JADX WARN: Removed duplicated region for block: B:164:0x0e12  */
    /* JADX WARN: Removed duplicated region for block: B:166:0x0e18  */
    @androidx.compose.runtime.ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @androidx.compose.runtime.Composable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit BillingScreen$lambda$140$0$34$0(double r155, final long r157, java.util.Map r159, final long r160, androidx.compose.runtime.State r162, final long r163, final android.content.Context r165, androidx.compose.runtime.MutableState r166, final long r167, androidx.compose.foundation.layout.ColumnScope r169, androidx.compose.runtime.Composer r170, int r171) {
        /*
            Method dump skipped, instructions count: 4552
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen$lambda$140$0$34$0(double, long, java.util.Map, long, androidx.compose.runtime.State, long, android.content.Context, androidx.compose.runtime.MutableState, long, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    private static final int BillingScreen$lambda$140$0$34$0$0$1(MutableState<Integer> mutableState) {
        return ((Number) ((State) mutableState).getValue()).intValue();
    }

    private static final void BillingScreen$lambda$140$0$34$0$0$2(MutableState<Integer> mutableState, int i) {
        mutableState.setValue(Integer.valueOf(i));
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$34$0$0$3(final MutableState $splitTab$delegate, final long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3493@233389L16,3494@233450L123,3491@233276L331,3498@233753L16,3499@233814L123,3496@233640L331,3503@234117L16,3504@234178L120,3501@234004L328:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(299390991, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3491)");
            }
            boolean z = BillingScreen$lambda$140$0$34$0$0$1($splitTab$delegate) == 0;
            ComposerKt.sourceInformationMarkerStart($composer, -48061761, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue = $composer.rememberedValue();
            if (rememberedValue == Composer.Companion.getEmpty()) {
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda235
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$34$0$0$3$0$0;
                        BillingScreen$lambda$140$0$34$0$0$3$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$34$0$0$3$0$0($splitTab$delegate);
                        return BillingScreen$lambda$140$0$34$0$0$3$0$0;
                    }
                };
                $composer.updateRememberedValue(obj);
                rememberedValue = obj;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.Tab-wqdebIU(z, (Function0) rememberedValue, (Modifier) null, false, ComposableLambdaKt.rememberComposableLambda(-1371987851, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda236
                public final Object invoke(Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$34$0$0$3$1;
                    BillingScreen$lambda$140$0$34$0$0$3$1 = BillingScreenKt.BillingScreen$lambda$140$0$34$0$0$3$1($TextSecondary, $splitTab$delegate, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$34$0$0$3$1;
                }
            }, $composer, 54), (Function2) null, 0L, 0L, (MutableInteractionSource) null, $composer, 24624, 492);
            boolean z2 = BillingScreen$lambda$140$0$34$0$0$1($splitTab$delegate) == 1;
            ComposerKt.sourceInformationMarkerStart($composer, -48050113, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue2 = $composer.rememberedValue();
            if (rememberedValue2 == Composer.Companion.getEmpty()) {
                Object obj2 = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda237
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$34$0$0$3$2$0;
                        BillingScreen$lambda$140$0$34$0$0$3$2$0 = BillingScreenKt.BillingScreen$lambda$140$0$34$0$0$3$2$0($splitTab$delegate);
                        return BillingScreen$lambda$140$0$34$0$0$3$2$0;
                    }
                };
                $composer.updateRememberedValue(obj2);
                rememberedValue2 = obj2;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.Tab-wqdebIU(z2, (Function0) rememberedValue2, (Modifier) null, false, ComposableLambdaKt.rememberComposableLambda(1621439020, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda238
                public final Object invoke(Object obj3, Object obj4) {
                    Unit BillingScreen$lambda$140$0$34$0$0$3$3;
                    BillingScreen$lambda$140$0$34$0$0$3$3 = BillingScreenKt.BillingScreen$lambda$140$0$34$0$0$3$3($TextSecondary, $splitTab$delegate, (Composer) obj3, ((Integer) obj4).intValue());
                    return BillingScreen$lambda$140$0$34$0$0$3$3;
                }
            }, $composer, 54), (Function2) null, 0L, 0L, (MutableInteractionSource) null, $composer, 24624, 492);
            boolean z3 = BillingScreen$lambda$140$0$34$0$0$1($splitTab$delegate) == 2;
            ComposerKt.sourceInformationMarkerStart($composer, -48038465, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue3 = $composer.rememberedValue();
            if (rememberedValue3 == Composer.Companion.getEmpty()) {
                Object obj3 = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda239
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$34$0$0$3$4$0;
                        BillingScreen$lambda$140$0$34$0$0$3$4$0 = BillingScreenKt.BillingScreen$lambda$140$0$34$0$0$3$4$0($splitTab$delegate);
                        return BillingScreen$lambda$140$0$34$0$0$3$4$0;
                    }
                };
                $composer.updateRememberedValue(obj3);
                rememberedValue3 = obj3;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.Tab-wqdebIU(z3, (Function0) rememberedValue3, (Modifier) null, false, ComposableLambdaKt.rememberComposableLambda(1980853357, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda240
                public final Object invoke(Object obj4, Object obj5) {
                    Unit BillingScreen$lambda$140$0$34$0$0$3$5;
                    BillingScreen$lambda$140$0$34$0$0$3$5 = BillingScreenKt.BillingScreen$lambda$140$0$34$0$0$3$5($TextSecondary, $splitTab$delegate, (Composer) obj4, ((Integer) obj5).intValue());
                    return BillingScreen$lambda$140$0$34$0$0$3$5;
                }
            }, $composer, 54), (Function2) null, 0L, 0L, (MutableInteractionSource) null, $composer, 24624, 492);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$34$0$0$3$0$0(MutableState $splitTab$delegate) {
        BillingScreen$lambda$140$0$34$0$0$2($splitTab$delegate, 0);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$34$0$0$3$1(long $TextSecondary, MutableState $splitTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3494@233452L119:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1371987851, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3494)");
            }
            TextKt.Text-Nvy7gAk("Portion", (Modifier) null, BillingScreen$lambda$140$0$34$0$0$1($splitTab$delegate) == 0 ? ColorKt.getSaSGreen() : $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$34$0$0$3$2$0(MutableState $splitTab$delegate) {
        BillingScreen$lambda$140$0$34$0$0$2($splitTab$delegate, 1);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$34$0$0$3$3(long $TextSecondary, MutableState $splitTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3499@233816L119:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1621439020, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3499)");
            }
            TextKt.Text-Nvy7gAk("Percent", (Modifier) null, BillingScreen$lambda$140$0$34$0$0$1($splitTab$delegate) == 1 ? ColorKt.getSaSGreen() : $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$34$0$0$3$4$0(MutableState $splitTab$delegate) {
        BillingScreen$lambda$140$0$34$0$0$2($splitTab$delegate, 2);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$34$0$0$3$5(long $TextSecondary, MutableState $splitTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3504@234180L116:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1980853357, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3504)");
            }
            TextKt.Text-Nvy7gAk("Item", (Modifier) null, BillingScreen$lambda$140$0$34$0$0$1($splitTab$delegate) == 2 ? ColorKt.getSaSGreen() : $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    private static final int BillingScreen$lambda$140$0$34$0$0$5(MutableState<Integer> mutableState) {
        return ((Number) ((State) mutableState).getValue()).intValue();
    }

    private static final void BillingScreen$lambda$140$0$34$0$0$6(MutableState<Integer> mutableState, int i) {
        mutableState.setValue(Integer.valueOf(i));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$34$0$0$7$0$0$0$0(int $num, MutableState $portions$delegate) {
        BillingScreen$lambda$140$0$34$0$0$6($portions$delegate, $num);
        return Unit.INSTANCE;
    }

    private static final String BillingScreen$lambda$140$0$34$0$0$9(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$34$0$0$11$0$0(MutableState $percentInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $percentInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$34$0$0$13$0(List $itemsList, SnapshotStateMap $itemAssignments, long $InputDark, long $CardDark, LazyListScope $this$LazyColumn) {
        Intrinsics.checkNotNullParameter($this$LazyColumn, "$this$LazyColumn");
        $this$LazyColumn.items($itemsList.size(), (Function1) null, new BillingScreenKt$BillingScreen$lambda$140$0$34$0$0$13$0$.inlined.items.default.3(BillingScreenKt$BillingScreen$lambda$140$0$34$0$0$13$0$.inlined.items.default.1.INSTANCE, $itemsList), ComposableLambdaKt.composableLambdaInstance(802480018, true, new BillingScreenKt$BillingScreen$lambda$140$0$34$0$0$13$0$.inlined.items.default.4($itemsList, $itemAssignments, $InputDark, $CardDark)));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$34$0$0$17$0$0(MutableState $showSplitBillDialog$delegate) {
        BillingScreen$lambda$112($showSplitBillDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit BillingScreen$lambda$140$0$34$0$0$17$1(long $TextPrimary, RowScope $this$Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter($this$Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C3636@243885L35:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(334274763, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3636)");
            }
            TextKt.Text-Nvy7gAk("Cancel", (Modifier) null, $TextPrimary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$34$0$0$17$2$0(Context $context, MutableState $showSplitBillDialog$delegate) {
        BillingScreen$lambda$112($showSplitBillDialog$delegate, false);
        Toast.makeText($context, "Bill split successfully", 0).show();
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    /* renamed from: FlowCard-FHprtrg, reason: not valid java name */
    private static final void m87FlowCardFHprtrg(Modifier modifier, final String title, final String subtext, final ImageVector icon, final long iconColor, final Function0<Unit> function0, Composer $composer, final int $changed, final int i) {
        Modifier modifier2;
        String str;
        String str2;
        ImageVector imageVector;
        Function0<Unit> function02;
        int $dirty;
        final Modifier modifier3;
        Modifier modifier4;
        Composer $composer2 = $composer.startRestartGroup(-589557774);
        ComposerKt.sourceInformation($composer2, "C(FlowCard)N(modifier,title,subtext,icon,iconColor:c#ui.graphics.Color,onClick)3667@244995L11,3668@245051L11,3669@245109L11,3676@245321L38,3678@245416L890,3671@245143L1163:BillingScreen.kt#7ez3px");
        int $dirty2 = $changed;
        int i2 = i & 1;
        if (i2 != 0) {
            $dirty2 |= 6;
            modifier2 = modifier;
        } else if (($changed & 6) == 0) {
            modifier2 = modifier;
            $dirty2 |= $composer2.changed(modifier2) ? 4 : 2;
        } else {
            modifier2 = modifier;
        }
        if (($changed & 48) == 0) {
            str = title;
            $dirty2 |= $composer2.changed(str) ? 32 : 16;
        } else {
            str = title;
        }
        if (($changed & 384) == 0) {
            str2 = subtext;
            $dirty2 |= $composer2.changed(str2) ? 256 : 128;
        } else {
            str2 = subtext;
        }
        if (($changed & 3072) == 0) {
            imageVector = icon;
            $dirty2 |= $composer2.changed(imageVector) ? 2048 : 1024;
        } else {
            imageVector = icon;
        }
        if (($changed & 24576) == 0) {
            $dirty2 |= $composer2.changed(iconColor) ? 16384 : 8192;
        }
        if ((196608 & $changed) == 0) {
            function02 = function0;
            $dirty2 |= $composer2.changedInstance(function02) ? 131072 : 65536;
        } else {
            function02 = function0;
        }
        if (!$composer2.shouldExecute((74899 & $dirty2) != 74898, $dirty2 & 1)) {
            $dirty = $dirty2;
            $composer2.skipToGroupEnd();
            modifier3 = modifier2;
        } else {
            if (i2 != 0) {
                modifier4 = (Modifier) Modifier.Companion;
            } else {
                modifier4 = modifier2;
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-589557774, $dirty2, -1, "com.example.sasloopmanager.FlowCard (BillingScreen.kt:3666)");
            }
            long cardColor = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getSurface-0d7_KjU();
            long borderColor = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOutline-0d7_KjU();
            final long textSecondary = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnSurfaceVariant-0d7_KjU();
            Modifier modifier5 = ClickableKt.clickable-oSLSa3U$default(SizeKt.height-3ABfNKs(modifier4, Dp.constructor-impl(130)), false, (String) null, (Role) null, (MutableInteractionSource) null, function02, 15, (Object) null);
            Shape shape = RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(16));
            $dirty = $dirty2;
            CardColors cardColors = CardDefaults.INSTANCE.cardColors-ro_MJ88(cardColor, 0L, 0L, 0L, $composer2, CardDefaults.$stable << 12, 14);
            $composer2 = $composer2;
            final String str3 = str;
            final String str4 = str2;
            final ImageVector imageVector2 = imageVector;
            CardKt.Card(modifier5, shape, cardColors, (CardElevation) null, BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), borderColor), ComposableLambdaKt.rememberComposableLambda(1976965988, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda22
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    return BillingScreenKt.FlowCard_FHprtrg$lambda$0(iconColor, imageVector2, str3, str4, textSecondary, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                }
            }, $composer2, 54), $composer2, 196608, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
            modifier3 = modifier4;
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope(new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda23
                public final Object invoke(Object obj, Object obj2) {
                    return BillingScreenKt.FlowCard_FHprtrg$lambda$1(modifier3, title, subtext, icon, iconColor, function0, $changed, i, (Composer) obj, ((Integer) obj2).intValue());
                }
            });
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit FlowCard_FHprtrg$lambda$0(long $iconColor, ImageVector $icon, String $title, String $subtext, long $textSecondary, ColumnScope $this$Card, Composer $composer, int $changed) {
        Function0 function0;
        Function0 function02;
        Function0 function03;
        Intrinsics.checkNotNullParameter($this$Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C3679@245426L874:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1976965988, $changed, -1, "com.example.sasloopmanager.FlowCard.<anonymous> (BillingScreen.kt:3679)");
            }
            Modifier modifier = PaddingKt.padding-3ABfNKs(SizeKt.fillMaxSize$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(14));
            Arrangement.Vertical spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(spaceBetween, Alignment.Companion.getStart(), $composer, ((54 >> 3) & 14) | ((54 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = ((((54 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, columnMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope = ColumnScopeInstance.INSTANCE;
            int i3 = ((54 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 1259130532, "C3685@245613L356,3694@245982L308:BillingScreen.kt#7ez3px");
            Modifier modifier2 = BackgroundKt.background-bw27NRU$default(ClipKt.clip(SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(36)), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(10))), Color.copy-wmQWz5c$default($iconColor, 0.15f, 0.0f, 0.0f, 0.0f, 14, (Object) null), (Shape) null, 2, (Object) null);
            Alignment center = Alignment.Companion.getCenter();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap2 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer, modifier2);
            Function0 constructor2 = ComposeUiNode.Companion.getConstructor();
            int i4 = ((((48 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function02 = constructor2;
                $composer.createNode(function02);
            } else {
                function02 = constructor2;
                $composer.useNode();
            }
            Composer composer2 = Updater.constructor-impl($composer);
            Updater.set-impl(composer2, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer2, currentCompositionLocalMap2, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer2, Integer.valueOf(hashCode2), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer2, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer2, materializeModifier2, ComposeUiNode.Companion.getSetModifier());
            int i5 = (i4 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i6 = ((48 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -611467776, "C3692@245888L67:BillingScreen.kt#7ez3px");
            IconKt.Icon-ww6aTOc($icon, (String) null, SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(20)), $iconColor, $composer, 432, 0);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            Modifier modifier3 = Modifier.Companion;
            MeasurePolicy columnMeasurePolicy2 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), $composer, ((0 >> 3) & 14) | ((0 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap3 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier3 = ComposedModifierKt.materializeModifier($composer, modifier3);
            Function0 constructor3 = ComposeUiNode.Companion.getConstructor();
            int i7 = ((((0 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function03 = constructor3;
                $composer.createNode(function03);
            } else {
                function03 = constructor3;
                $composer.useNode();
            }
            Composer composer3 = Updater.constructor-impl($composer);
            Updater.set-impl(composer3, columnMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer3, currentCompositionLocalMap3, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer3, Integer.valueOf(hashCode3), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer3, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer3, materializeModifier3, ComposeUiNode.Companion.getSetModifier());
            int i8 = (i7 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope2 = ColumnScopeInstance.INSTANCE;
            int i9 = ((0 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 1420085254, "C3695@246041L11,3695@246007L104,3696@246128L29,3697@246174L102:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk($title, (Modifier) null, MaterialTheme.INSTANCE.getColorScheme($composer, MaterialTheme.$stable).getOnSurface-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(14), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597440, 0, 262058);
            SpacerKt.Spacer(SizeKt.height-3ABfNKs(Modifier.Companion, Dp.constructor-impl(3)), $composer, 6);
            TextKt.Text-Nvy7gAk($subtext, (Modifier) null, $textSecondary, (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, TextOverflow.Companion.getEllipsis-gIe3tQ8(), false, 1, 0, (Function1) null, (TextStyle) null, $composer, 24576, 24960, 241642);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final void TableCard(final TableItem table, final String status, final Double orderTotal, final int orderItemsCount, final Function0<Unit> function0, final boolean showBillDetails, final boolean showOrderStatus, final String currency, final int decimalPlaces, final boolean showKOTNoOnTable, final boolean displayTimeOnTable, final Order activeOrder, final Long activeTimestamp, boolean isSelected, Composer $composer, final int $changed, final int $changed1, final int i) {
        TableItem tableItem;
        int i2;
        Composer $composer2;
        final boolean isSelected2;
        long tableStatusAvailable;
        String str;
        MutableState ticks$delegate;
        String displayStatus;
        BorderStroke borderStroke;
        Composer $composer3 = $composer.startRestartGroup(1790144612);
        ComposerKt.sourceInformation($composer3, "C(TableCard)N(table,status,orderTotal,orderItemsCount,onClick,showBillDetails,showOrderStatus,currency,decimalPlaces,showKOTNoOnTable,displayTimeOnTable,activeOrder,activeTimestamp,isSelected)3724@246952L30,3770@248376L38,3772@248452L4617,3764@248170L4899:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        int $dirty1 = $changed1;
        if (($changed & 6) == 0) {
            tableItem = table;
            $dirty |= $composer3.changed(tableItem) ? 4 : 2;
        } else {
            tableItem = table;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer3.changed(status) ? 32 : 16;
        }
        if (($changed & 384) == 0) {
            $dirty |= $composer3.changed(orderTotal) ? 256 : 128;
        }
        if (($changed & 3072) == 0) {
            i2 = orderItemsCount;
            $dirty |= $composer3.changed(i2) ? 2048 : 1024;
        } else {
            i2 = orderItemsCount;
        }
        if (($changed & 24576) == 0) {
            $dirty |= $composer3.changedInstance(function0) ? 16384 : 8192;
        }
        if (($changed & 196608) == 0) {
            $dirty |= $composer3.changed(showBillDetails) ? 131072 : 65536;
        }
        if (($changed & 1572864) == 0) {
            $dirty |= $composer3.changed(showOrderStatus) ? 1048576 : 524288;
        }
        if (($changed & 12582912) == 0) {
            $dirty |= $composer3.changed(currency) ? 8388608 : 4194304;
        }
        if (($changed & 100663296) == 0) {
            $dirty |= $composer3.changed(decimalPlaces) ? 67108864 : 33554432;
        }
        if (($changed & 805306368) == 0) {
            $dirty |= $composer3.changed(showKOTNoOnTable) ? 536870912 : 268435456;
        }
        if (($changed1 & 6) == 0) {
            $dirty1 |= $composer3.changed(displayTimeOnTable) ? 4 : 2;
        }
        if (($changed1 & 48) == 0) {
            $dirty1 |= ($changed1 & 64) == 0 ? $composer3.changed(activeOrder) : $composer3.changedInstance(activeOrder) ? 32 : 16;
        }
        if (($changed1 & 384) == 0) {
            $dirty1 |= $composer3.changed(activeTimestamp) ? 256 : 128;
        }
        int i3 = i & 8192;
        if (i3 != 0) {
            $dirty1 |= 3072;
        } else if (($changed1 & 3072) == 0) {
            $dirty1 |= $composer3.changed(isSelected) ? 2048 : 1024;
        }
        if ($composer3.shouldExecute((($dirty & 306783379) == 306783378 && ($dirty1 & 1171) == 1170) ? false : true, $dirty & 1)) {
            boolean isSelected3 = i3 != 0 ? false : isSelected;
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1790144612, $dirty, $dirty1, "com.example.sasloopmanager.TableCard (BillingScreen.kt:3720)");
            }
            String statusUpper = status.toUpperCase(Locale.ROOT);
            Intrinsics.checkNotNullExpressionValue(statusUpper, "toUpperCase(...)");
            final boolean isOccupied = (Intrinsics.areEqual(statusUpper, "AVAILABLE") || Intrinsics.areEqual(statusUpper, "VACANT")) ? false : true;
            boolean isSelected4 = isSelected3;
            ComposerKt.sourceInformationMarkerStart($composer3, -1952895678, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue = $composer3.rememberedValue();
            int $dirty12 = $dirty1;
            if (rememberedValue == Composer.Companion.getEmpty()) {
                rememberedValue = SnapshotStateKt.mutableStateOf$default(0, (SnapshotMutationPolicy) null, 2, (Object) null);
                $composer3.updateRememberedValue(rememberedValue);
            }
            MutableState ticks$delegate2 = (MutableState) rememberedValue;
            ComposerKt.sourceInformationMarkerEnd($composer3);
            if (!displayTimeOnTable || activeTimestamp == null || activeTimestamp.longValue() <= 0) {
                $composer3.startReplaceGroup(-409963906);
                $composer3.endReplaceGroup();
            } else {
                $composer3.startReplaceGroup(-410111900);
                ComposerKt.sourceInformation($composer3, "3726@247103L106,3726@247071L138");
                ComposerKt.sourceInformationMarkerStart($composer3, -1952890770, "CC(remember):BillingScreen.kt#9igjgp");
                Object rememberedValue2 = $composer3.rememberedValue();
                if (rememberedValue2 == Composer.Companion.getEmpty()) {
                    Object obj = (Function2) new TableCard.1.1(ticks$delegate2, (Continuation) null);
                    $composer3.updateRememberedValue(obj);
                    rememberedValue2 = obj;
                }
                ComposerKt.sourceInformationMarkerEnd($composer3);
                EffectsKt.LaunchedEffect(activeTimestamp, (Function2) rememberedValue2, $composer3, ($dirty12 >> 6) & 14);
                $composer3.endReplaceGroup();
            }
            switch (statusUpper.hashCode()) {
                case -1226282194:
                    if (statusUpper.equals("DRAFT_PRINTED")) {
                        tableStatusAvailable = ColorKt.getTableStatusDraftPrinted();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                case 78673511:
                    if (statusUpper.equals("SAVED")) {
                        tableStatusAvailable = ColorKt.getTableStatusSaved();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                case 403264492:
                    if (statusUpper.equals("PRINTED")) {
                        tableStatusAvailable = ColorKt.getTableStatusPrinted();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                case 432241448:
                    if (statusUpper.equals("RESERVED")) {
                        tableStatusAvailable = ColorKt.getTableStatusReserved();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                case 1301183189:
                    if (statusUpper.equals("ITEMS_IN_KOT")) {
                        tableStatusAvailable = ColorKt.getTableStatusItemsInKot();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                case 1953666095:
                    if (statusUpper.equals("BILL_SAVED")) {
                        tableStatusAvailable = ColorKt.getTableStatusBillSaved();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                case 2016941524:
                    if (statusUpper.equals("ORDERING")) {
                        tableStatusAvailable = ColorKt.getTableStatusOrdering();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                default:
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
            }
            long statusColor = tableStatusAvailable;
            switch (statusUpper.hashCode()) {
                case -1226282194:
                    if (statusUpper.equals("DRAFT_PRINTED")) {
                        str = "DRAFT PRINTED";
                        break;
                    }
                    str = statusUpper;
                    break;
                case 1301183189:
                    if (statusUpper.equals("ITEMS_IN_KOT")) {
                        str = "ITEMS IN KOT";
                        break;
                    }
                    str = statusUpper;
                    break;
                case 1953666095:
                    if (statusUpper.equals("BILL_SAVED")) {
                        str = "BILL SAVED";
                        break;
                    }
                    str = statusUpper;
                    break;
                case 2052692649:
                    if (statusUpper.equals("AVAILABLE")) {
                        str = "VACANT";
                        break;
                    }
                    str = statusUpper;
                    break;
                default:
                    str = statusUpper;
                    break;
            }
            String displayStatus2 = str;
            long borderColor = Color.copy-wmQWz5c$default(Color.Companion.getWhite-0d7_KjU(), 0.15f, 0.0f, 0.0f, 0.0f, 14, (Object) null);
            final long badgeBgColor = Color.copy-wmQWz5c$default(Color.Companion.getWhite-0d7_KjU(), 0.2f, 0.0f, 0.0f, 0.0f, 14, (Object) null);
            final long badgeTextColor = Color.Companion.getWhite-0d7_KjU();
            if (isSelected4) {
                ticks$delegate = ticks$delegate2;
                displayStatus = displayStatus2;
                borderStroke = BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(3), androidx.compose.ui.graphics.ColorKt.Color(4294286859L));
            } else {
                ticks$delegate = ticks$delegate2;
                displayStatus = displayStatus2;
                borderStroke = BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), borderColor);
            }
            final String displayStatus3 = displayStatus;
            final int i4 = i2;
            final MutableState ticks$delegate3 = ticks$delegate;
            final TableItem tableItem2 = tableItem;
            CardKt.Card(ClickableKt.clickable-oSLSa3U$default(SizeKt.height-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(105)), false, (String) null, (Role) null, (MutableInteractionSource) null, function0, 15, (Object) null), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(16)), CardDefaults.INSTANCE.cardColors-ro_MJ88(statusColor, 0L, 0L, 0L, $composer3, CardDefaults.$stable << 12, 14), (CardElevation) null, borderStroke, ComposableLambdaKt.rememberComposableLambda(526908246, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda249
                public final Object invoke(Object obj2, Object obj3, Object obj4) {
                    return BillingScreenKt.TableCard$lambda$4(isOccupied, orderTotal, showBillDetails, tableItem2, displayTimeOnTable, activeTimestamp, showKOTNoOnTable, activeOrder, showOrderStatus, badgeBgColor, ticks$delegate3, displayStatus3, badgeTextColor, i4, currency, decimalPlaces, (ColumnScope) obj2, (Composer) obj3, ((Integer) obj4).intValue());
                }
            }, $composer3, 54), $composer3, 196608, 8);
            $composer2 = $composer3;
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
            isSelected2 = isSelected4;
        } else {
            $composer2 = $composer3;
            $composer2.skipToGroupEnd();
            isSelected2 = isSelected;
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope(new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda250
                public final Object invoke(Object obj2, Object obj3) {
                    return BillingScreenKt.TableCard$lambda$5(table, status, orderTotal, orderItemsCount, function0, showBillDetails, showOrderStatus, currency, decimalPlaces, showKOTNoOnTable, displayTimeOnTable, activeOrder, activeTimestamp, isSelected2, $changed, $changed1, i, (Composer) obj2, ((Integer) obj3).intValue());
                }
            });
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final int TableCard$lambda$1(MutableState<Integer> mutableState) {
        return ((Number) ((State) mutableState).getValue()).intValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final void TableCard$lambda$2(MutableState<Integer> mutableState, int i) {
        mutableState.setValue(Integer.valueOf(i));
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* JADX WARN: Removed duplicated region for block: B:45:0x0554  */
    /* JADX WARN: Removed duplicated region for block: B:76:0x0575  */
    @androidx.compose.runtime.ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @androidx.compose.runtime.Composable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit TableCard$lambda$4(boolean r163, java.lang.Double r164, boolean r165, com.example.sasloopmanager.data.TableItem r166, boolean r167, java.lang.Long r168, boolean r169, final com.example.sasloopmanager.data.Order r170, boolean r171, long r172, androidx.compose.runtime.MutableState r174, final java.lang.String r175, final long r176, int r178, java.lang.String r179, int r180, androidx.compose.foundation.layout.ColumnScope r181, androidx.compose.runtime.Composer r182, int r183) {
        /*
            Method dump skipped, instructions count: 2427
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.TableCard$lambda$4(boolean, java.lang.Double, boolean, com.example.sasloopmanager.data.TableItem, boolean, java.lang.Long, boolean, com.example.sasloopmanager.data.Order, boolean, long, androidx.compose.runtime.MutableState, java.lang.String, long, int, java.lang.String, int, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit TableCard$lambda$4$0$0$0$0$1(String $elapsedStr, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3807@250065L370:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-527706672, $changed, -1, "com.example.sasloopmanager.TableCard.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3807)");
            }
            TextKt.Text-Nvy7gAk($elapsedStr, PaddingKt.padding-VpY3zN4(Modifier.Companion, Dp.constructor-impl(5), Dp.constructor-impl(2)), Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(9), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597872, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit TableCard$lambda$4$0$0$0$0$2(Order $activeOrder, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3822@250803L384:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1243044025, $changed, -1, "com.example.sasloopmanager.TableCard.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3822)");
            }
            TextKt.Text-Nvy7gAk("KOT #" + $activeOrder.getId(), PaddingKt.padding-VpY3zN4(Modifier.Companion, Dp.constructor-impl(5), Dp.constructor-impl(2)), Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(9), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597872, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit TableCard$lambda$4$0$0$0$0$3(String $displayStatus, long $badgeTextColor, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3837@251513L376:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1696422856, $changed, -1, "com.example.sasloopmanager.TableCard.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3837)");
            }
            TextKt.Text-Nvy7gAk($displayStatus, PaddingKt.padding-VpY3zN4(Modifier.Companion, Dp.constructor-impl(6), Dp.constructor-impl(3)), $badgeTextColor, (TextAutoSize) null, TextUnitKt.getSp(8), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597872, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Removed duplicated region for block: B:110:0x027e  */
    /* JADX WARN: Removed duplicated region for block: B:117:0x02bb  */
    /* JADX WARN: Removed duplicated region for block: B:119:0x02c6 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:122:0x02cd  */
    /* JADX WARN: Removed duplicated region for block: B:131:0x02ea  */
    /* JADX WARN: Removed duplicated region for block: B:137:0x03d3  */
    /* JADX WARN: Removed duplicated region for block: B:146:0x0331  */
    /* JADX WARN: Removed duplicated region for block: B:150:0x02c0  */
    @androidx.compose.runtime.ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @androidx.compose.runtime.Composable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final void MenuItemCard(final com.example.sasloopmanager.data.MenuItem r47, final int r48, final int r49, final kotlin.jvm.functions.Function0<kotlin.Unit> r50, final kotlin.jvm.functions.Function0<kotlin.Unit> r51, final boolean r52, final java.lang.String r53, final boolean r54, final int r55, boolean r56, boolean r57, boolean r58, androidx.compose.runtime.Composer r59, final int r60, final int r61, final int r62) {
        /*
            Method dump skipped, instructions count: 1044
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.MenuItemCard(com.example.sasloopmanager.data.MenuItem, int, int, kotlin.jvm.functions.Function0, kotlin.jvm.functions.Function0, boolean, java.lang.String, boolean, int, boolean, boolean, boolean, androidx.compose.runtime.Composer, int, int, int):void");
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* JADX WARN: Code restructure failed: missing block: B:117:0x0e62, code lost:
    
        if (r0 == null) goto L128;
     */
    /* JADX WARN: Code restructure failed: missing block: B:179:0x15b7, code lost:
    
        if (r11 == androidx.compose.runtime.Composer.Companion.getEmpty()) goto L215;
     */
    /* JADX WARN: Removed duplicated region for block: B:128:0x0f8c  */
    /* JADX WARN: Removed duplicated region for block: B:138:0x10ca  */
    /* JADX WARN: Removed duplicated region for block: B:141:0x10d6  */
    /* JADX WARN: Removed duplicated region for block: B:144:0x11d2  */
    /* JADX WARN: Removed duplicated region for block: B:166:0x1410  */
    /* JADX WARN: Removed duplicated region for block: B:169:0x141c  */
    /* JADX WARN: Removed duplicated region for block: B:172:0x149b  */
    /* JADX WARN: Removed duplicated region for block: B:178:0x15af  */
    /* JADX WARN: Removed duplicated region for block: B:183:0x1652  */
    /* JADX WARN: Removed duplicated region for block: B:186:0x165e  */
    /* JADX WARN: Removed duplicated region for block: B:189:0x1664  */
    /* JADX WARN: Removed duplicated region for block: B:190:0x15bb  */
    /* JADX WARN: Removed duplicated region for block: B:192:0x14e6  */
    /* JADX WARN: Removed duplicated region for block: B:193:0x1422  */
    /* JADX WARN: Removed duplicated region for block: B:200:0x173f  */
    /* JADX WARN: Removed duplicated region for block: B:205:0x10da  */
    /* JADX WARN: Removed duplicated region for block: B:212:0x102a  */
    /* JADX WARN: Removed duplicated region for block: B:54:0x083d  */
    /* JADX WARN: Removed duplicated region for block: B:63:0x09a5  */
    @androidx.compose.runtime.ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @androidx.compose.runtime.Composable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit MenuItemCard$lambda$1(boolean r144, float r145, boolean r146, java.lang.String r147, com.example.sasloopmanager.data.MenuItem r148, long r149, int r151, int r152, boolean r153, final kotlin.jvm.functions.Function0 r154, java.lang.String r155, int r156, boolean r157, boolean r158, float r159, long r160, long r162, final boolean r164, long r165, float r167, long r168, final kotlin.jvm.functions.Function0 r170, long r171, float r173, androidx.compose.foundation.layout.ColumnScope r174, androidx.compose.runtime.Composer r175, int r176) {
        /*
            Method dump skipped, instructions count: 6178
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.MenuItemCard$lambda$1(boolean, float, boolean, java.lang.String, com.example.sasloopmanager.data.MenuItem, long, int, int, boolean, kotlin.jvm.functions.Function0, java.lang.String, int, boolean, boolean, float, long, long, boolean, long, float, long, kotlin.jvm.functions.Function0, long, float, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit MenuItemCard$lambda$1$0$1(int $totalQty, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C4005@258530L348:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1106993098, $changed, -1, "com.example.sasloopmanager.MenuItemCard.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:4005)");
            }
            Alignment center = Alignment.Companion.getCenter();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            Modifier modifier = Modifier.Companion;
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = ((((48 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i3 = ((48 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 1791748588, "C4006@258601L251:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk(String.valueOf($totalQty), (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597824, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit MenuItemCard$lambda$1$0$2(int $resolvedPrepTime, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C4026@259544L337:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(988842453, $changed, -1, "com.example.sasloopmanager.MenuItemCard.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:4026)");
            }
            TextKt.Text-Nvy7gAk("🕒 " + $resolvedPrepTime + "m", PaddingKt.padding-VpY3zN4(Modifier.Companion, Dp.constructor-impl(4), Dp.constructor-impl(2)), Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(8), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597872, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit MenuItemCard$lambda$1$0$4$0(Function0 $onAdd) {
        $onAdd.invoke();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit MenuItemCard$lambda$1$1$3$0$0$0(Function0 $onRemove) {
        $onRemove.invoke();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit MenuItemCard$lambda$1$1$3$0$2$0(Function0 $onAdd) {
        $onAdd.invoke();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit MenuItemCard$lambda$1$1$3$1(boolean $isCompact, RowScope $this$Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter($this$Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C4226@268757L105:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1865522651, $changed, -1, "com.example.sasloopmanager.MenuItemCard.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:4226)");
            }
            TextKt.Text-Nvy7gAk("Add", (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp($isCompact ? 9 : 11), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1573254, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String formatPrice(double price, PosSettings posSettings) {
        StringCompanionObject stringCompanionObject = StringCompanionObject.INSTANCE;
        String format = String.format(Locale.US, "%." + posSettings.getDecimalPlaces() + "f", Arrays.copyOf(new Object[]{Double.valueOf(price)}, 1));
        Intrinsics.checkNotNullExpressionValue(format, "format(...)");
        return format;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    /* renamed from: ReceiptRow-6jM-SoI, reason: not valid java name */
    private static final void m88ReceiptRow6jMSoI(final String label, final String value, boolean isBold, long color, long fontSize, Composer $composer, final int $changed, final int i) {
        String str;
        boolean z;
        long color2;
        long j;
        final boolean isBold2;
        final long textPrimary;
        final long color3;
        boolean isBold3;
        long fontSize2;
        int i2;
        long j2;
        Function0 function0;
        Composer $composer2 = $composer.startRestartGroup(1071795232);
        ComposerKt.sourceInformation($composer2, "C(ReceiptRow)N(label,value,isBold,color:c#ui.graphics.Color,fontSize:c#ui.unit.TextUnit)4247@269397L11,4248@269457L11,4253@269616L590:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            str = label;
            $dirty |= $composer2.changed(str) ? 4 : 2;
        } else {
            str = label;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer2.changed(value) ? 32 : 16;
        }
        int i3 = i & 4;
        if (i3 != 0) {
            $dirty |= 384;
            z = isBold;
        } else if (($changed & 384) == 0) {
            z = isBold;
            $dirty |= $composer2.changed(z) ? 256 : 128;
        } else {
            z = isBold;
        }
        int i4 = i & 8;
        if (i4 != 0) {
            $dirty |= 3072;
            color2 = color;
        } else if (($changed & 3072) == 0) {
            color2 = color;
            $dirty |= $composer2.changed(color2) ? 2048 : 1024;
        } else {
            color2 = color;
        }
        int i5 = i & 16;
        if (i5 != 0) {
            $dirty |= 24576;
            j = fontSize;
        } else if (($changed & 24576) == 0) {
            j = fontSize;
            $dirty |= $composer2.changed(j) ? 16384 : 8192;
        } else {
            j = fontSize;
        }
        if ($composer2.shouldExecute(($dirty & 9363) != 9362, $dirty & 1)) {
            if (i3 != 0) {
                isBold3 = false;
            } else {
                isBold3 = z;
            }
            if (i4 != 0) {
                color2 = Color.Companion.getUnspecified-0d7_KjU();
            }
            if (i5 == 0) {
                fontSize2 = j;
                i2 = 1071795232;
            } else {
                fontSize2 = TextUnitKt.getSp(12);
                i2 = 1071795232;
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(i2, $dirty, -1, "com.example.sasloopmanager.ReceiptRow (BillingScreen.kt:4246)");
            }
            long textPrimary2 = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnSurface-0d7_KjU();
            long textSecondary = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnSurfaceVariant-0d7_KjU();
            if (Color.equals-impl0(color2, Color.Companion.getUnspecified-0d7_KjU())) {
                j2 = isBold3 ? textPrimary2 : textSecondary;
            } else {
                j2 = color2;
            }
            long displayColor = j2;
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null);
            Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, centerVertically, $composer2, ((438 >> 3) & 14) | ((438 >> 3) & 112));
            int $dirty2 = $dirty;
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer2, fillMaxWidth$default);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i6 = ((((438 << 3) & 112) << 6) & 896) | 6;
            boolean isBold4 = isBold3;
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                function0 = constructor;
                $composer2.createNode(function0);
            } else {
                function0 = constructor;
                $composer2.useNode();
            }
            Composer composer = Updater.constructor-impl($composer2);
            Updater.set-impl(composer, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i7 = (i6 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope = RowScopeInstance.INSTANCE;
            int i8 = ((438 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer2, -1745756439, "C4258@269794L214,4264@270017L183:BillingScreen.kt#7ez3px");
            long j3 = isBold4 ? textPrimary2 : textSecondary;
            FontWeight.Companion companion = FontWeight.Companion;
            TextKt.Text-Nvy7gAk(str, (Modifier) null, j3, (TextAutoSize) null, fontSize2, (FontStyle) null, isBold4 ? companion.getBold() : companion.getNormal(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, ($dirty2 & 14) | ($dirty2 & 57344), 0, 262058);
            FontWeight.Companion companion2 = FontWeight.Companion;
            TextKt.Text-Nvy7gAk(value, (Modifier) null, displayColor, (TextAutoSize) null, fontSize2, (FontStyle) null, isBold4 ? companion2.getBlack() : companion2.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, (($dirty2 >> 3) & 14) | ($dirty2 & 57344), 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
            textPrimary = color2;
            color3 = fontSize2;
            isBold2 = isBold4;
        } else {
            $composer2.skipToGroupEnd();
            isBold2 = z;
            textPrimary = color2;
            color3 = j;
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope(new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda80
                public final Object invoke(Object obj, Object obj2) {
                    return BillingScreenKt.ReceiptRow_6jM_SoI$lambda$1(label, value, isBold2, textPrimary, color3, $changed, i, (Composer) obj, ((Integer) obj2).intValue());
                }
            });
        }
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final void ItemCustomizationDialog(final MenuItem item, final List<OptionGroup> list, final Function0<Unit> function0, final Function2<? super List<SelectedModifier>, ? super String, Unit> function2, final String currency, Composer $composer, final int $changed) {
        Function2<? super List<SelectedModifier>, ? super String, Unit> function22;
        final String str;
        Context context;
        Composer $composer2 = $composer.startRestartGroup(-1745650077);
        ComposerKt.sourceInformation($composer2, "C(ItemCustomizationDialog)N(item,optionGroups,onDismiss,onAdd,currency)4281@270450L58,4282@270532L31,4283@270595L7,4285@270631L98,4289@270772L9065,4289@270735L9102:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            $dirty |= ($changed & 8) == 0 ? $composer2.changed(item) : $composer2.changedInstance(item) ? 4 : 2;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer2.changedInstance(list) ? 32 : 16;
        }
        if (($changed & 384) == 0) {
            $dirty |= $composer2.changedInstance(function0) ? 256 : 128;
        }
        if (($changed & 3072) == 0) {
            function22 = function2;
            $dirty |= $composer2.changedInstance(function22) ? 2048 : 1024;
        } else {
            function22 = function2;
        }
        if (($changed & 24576) == 0) {
            str = currency;
            $dirty |= $composer2.changed(str) ? 16384 : 8192;
        } else {
            str = currency;
        }
        int $dirty2 = $dirty;
        if (!$composer2.shouldExecute(($dirty2 & 9363) != 9362, $dirty2 & 1)) {
            $composer2.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1745650077, $dirty2, -1, "com.example.sasloopmanager.ItemCustomizationDialog (BillingScreen.kt:4280)");
            }
            ComposerKt.sourceInformationMarkerStart($composer2, 1762495837, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue = $composer2.rememberedValue();
            if (rememberedValue == Composer.Companion.getEmpty()) {
                Object mutableStateOf$default = SnapshotStateKt.mutableStateOf$default(CollectionsKt.emptyList(), (SnapshotMutationPolicy) null, 2, (Object) null);
                $composer2.updateRememberedValue(mutableStateOf$default);
                rememberedValue = mutableStateOf$default;
            }
            final MutableState selectedModifiers$delegate = (MutableState) rememberedValue;
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerStart($composer2, 1762498434, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue2 = $composer2.rememberedValue();
            if (rememberedValue2 == Composer.Companion.getEmpty()) {
                Object mutableStateOf$default2 = SnapshotStateKt.mutableStateOf$default("", (SnapshotMutationPolicy) null, 2, (Object) null);
                $composer2.updateRememberedValue(mutableStateOf$default2);
                rememberedValue2 = mutableStateOf$default2;
            }
            final MutableState kitchenNote$delegate = (MutableState) rememberedValue2;
            ComposerKt.sourceInformationMarkerEnd($composer2);
            CompositionLocal localContext = AndroidCompositionLocals_androidKt.getLocalContext();
            ComposerKt.sourceInformationMarkerStart($composer2, 2023513938, "CC(<get-current>):CompositionLocal.kt#9igjgp");
            Object consume = $composer2.consume(localContext);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            Context context2 = (Context) consume;
            int id = item.getId();
            ComposerKt.sourceInformationMarkerStart($composer2, 1762501669, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed = $composer2.changed(id) | $composer2.changed(list);
            int i = 0;
            Object rememberedValue3 = $composer2.rememberedValue();
            if (changed || rememberedValue3 == Composer.Companion.getEmpty()) {
                context = context2;
                Collection arrayList = new ArrayList();
                for (Object obj : list) {
                    boolean z = changed;
                    Integer itemId = ((OptionGroup) obj).getItemId();
                    int i2 = i;
                    if (itemId != null && itemId.intValue() == item.getId()) {
                        arrayList.add(obj);
                    }
                    changed = z;
                    i = i2;
                }
                Object obj2 = (List) arrayList;
                $composer2.updateRememberedValue(obj2);
                rememberedValue3 = obj2;
            } else {
                context = context2;
            }
            final List itemOptionGroups = (List) rememberedValue3;
            ComposerKt.sourceInformationMarkerEnd($composer2);
            final Function2<? super List<SelectedModifier>, ? super String, Unit> function23 = function22;
            final Context context3 = context;
            AndroidDialog_androidKt.Dialog(function0, (DialogProperties) null, ComposableLambdaKt.rememberComposableLambda(-1259160916, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda99
                public final Object invoke(Object obj3, Object obj4) {
                    return BillingScreenKt.ItemCustomizationDialog$lambda$7(itemOptionGroups, context3, function23, function0, item, selectedModifiers$delegate, str, kitchenNote$delegate, (Composer) obj3, ((Integer) obj4).intValue());
                }
            }, $composer2, 54), $composer2, (($dirty2 >> 6) & 14) | 384, 2);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope(new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda100
                public final Object invoke(Object obj3, Object obj4) {
                    return BillingScreenKt.ItemCustomizationDialog$lambda$8(item, list, function0, function2, currency, $changed, (Composer) obj3, ((Integer) obj4).intValue());
                }
            });
        }
    }

    private static final List<SelectedModifier> ItemCustomizationDialog$lambda$1(MutableState<List<SelectedModifier>> mutableState) {
        return (List) ((State) mutableState).getValue();
    }

    private static final String ItemCustomizationDialog$lambda$4(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit ItemCustomizationDialog$lambda$7(final List $itemOptionGroups, final Context $context, final Function2 $onAdd, final Function0 $onDismiss, final MenuItem $item, final MutableState $selectedModifiers$delegate, final String $currency, final MutableState $kitchenNote$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C4295@270966L37,4297@271071L8760,4290@270782L9049:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1259160916, $changed, -1, "com.example.sasloopmanager.ItemCustomizationDialog.<anonymous> (BillingScreen.kt:4290)");
            }
            CardKt.Card(PaddingKt.padding-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(16)), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(24)), CardDefaults.INSTANCE.cardColors-ro_MJ88(ColorKt.getCardDark(), 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), (CardElevation) null, BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), ColorKt.getCardBorderDark()), ComposableLambdaKt.rememberComposableLambda(613130362, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda38
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit ItemCustomizationDialog$lambda$7$0;
                    ItemCustomizationDialog$lambda$7$0 = BillingScreenKt.ItemCustomizationDialog$lambda$7$0($itemOptionGroups, $context, $onAdd, $onDismiss, $item, $selectedModifiers$delegate, $currency, $kitchenNote$delegate, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return ItemCustomizationDialog$lambda$7$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Type inference failed for: r6v59 */
    /* JADX WARN: Type inference failed for: r6v64 */
    /* JADX WARN: Type inference failed for: r6v68 */
    /* JADX WARN: Type inference failed for: r6v85 */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final Unit ItemCustomizationDialog$lambda$7$0(final List $itemOptionGroups, final Context $context, final Function2 $onAdd, Function0 $onDismiss, MenuItem $item, final MutableState $selectedModifiers$delegate, String $currency, MutableState $kitchenNote$delegate, ColumnScope $this$Card, Composer $composer, int $changed) {
        Function0 function0;
        Function0 function02;
        Function0 function03;
        Function0 function04;
        final MutableState mutableState;
        Function0 function05;
        Composer composer;
        ?? r6;
        final OptionItem optionItem;
        Object obj;
        Composer composer2;
        String str;
        Composer composer3;
        Alignment.Horizontal horizontal;
        Arrangement.Horizontal horizontal2;
        ColumnScope columnScope;
        String str2;
        Composer composer4;
        final double d;
        String str3;
        String str4;
        Composer composer5;
        Function0 function06;
        Intrinsics.checkNotNullParameter($this$Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C4298@271085L8736:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(613130362, $changed, -1, "com.example.sasloopmanager.ItemCustomizationDialog.<anonymous>.<anonymous> (BillingScreen.kt:4298)");
            }
            Modifier modifier = PaddingKt.padding-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(20));
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            Arrangement.Vertical top = Arrangement.INSTANCE.getTop();
            Alignment.Horizontal start = Alignment.Companion.getStart();
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(top, start, $composer, ((6 >> 3) & 14) | ((6 >> 3) & 112));
            String str5 = "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh";
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = ((((6 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer composer6 = Updater.constructor-impl($composer);
            Updater.set-impl(composer6, columnMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer6, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer6, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer6, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer6, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = (i >> 6) & 14;
            String str6 = "C89@4557L9:Column.kt#2w3rfo";
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            int i3 = ((6 >> 6) & 112) | 6;
            ColumnScope columnScope2 = ColumnScopeInstance.INSTANCE;
            Composer composer7 = $composer;
            Alignment.Horizontal horizontal3 = start;
            Composer composer8 = $composer;
            ComposerKt.sourceInformationMarkerStart(composer8, 478686939, "C4304@271259L1009,4328@272286L41,4334@272526L21,4331@272388L6209,4435@278615L41,4438@278712L565,4450@279448L39,4437@278674L1133:BillingScreen.kt#7ez3px");
            Composer composer9 = $composer;
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null);
            Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            String str7 = "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo";
            ComposerKt.sourceInformationMarkerStart(composer8, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, centerVertically, composer8, ((438 >> 3) & 14) | ((438 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart(composer8, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer8, 0));
            CompositionLocalMap currentCompositionLocalMap2 = composer8.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier(composer8, fillMaxWidth$default);
            Function0 constructor2 = ComposeUiNode.Companion.getConstructor();
            int i4 = ((((438 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart(composer8, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!(composer8.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            composer8.startReusableNode();
            if (composer8.getInserting()) {
                function02 = constructor2;
                composer8.createNode(function02);
            } else {
                function02 = constructor2;
                composer8.useNode();
            }
            Composer composer10 = Updater.constructor-impl(composer8);
            Updater.set-impl(composer10, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer10, currentCompositionLocalMap2, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer10, Integer.valueOf(hashCode2), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer10, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer10, materializeModifier2, ComposeUiNode.Companion.getSetModifier());
            int i5 = (i4 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart(composer8, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope = RowScopeInstance.INSTANCE;
            int i6 = ((438 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart(composer8, 675233554, "C4309@271497L577,4323@272095L155:BillingScreen.kt#7ez3px");
            ComposerKt.sourceInformationMarkerStart(composer8, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            Modifier modifier2 = Modifier.Companion;
            MeasurePolicy columnMeasurePolicy2 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), composer8, ((0 >> 3) & 14) | ((0 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart(composer8, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer8, 0));
            CompositionLocalMap currentCompositionLocalMap3 = composer8.getCurrentCompositionLocalMap();
            Modifier materializeModifier3 = ComposedModifierKt.materializeModifier(composer8, modifier2);
            Function0 constructor3 = ComposeUiNode.Companion.getConstructor();
            int i7 = ((((0 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart(composer8, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!(composer8.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            composer8.startReusableNode();
            if (composer8.getInserting()) {
                function03 = constructor3;
                composer8.createNode(function03);
            } else {
                function03 = constructor3;
                composer8.useNode();
            }
            Composer composer11 = Updater.constructor-impl(composer8);
            Updater.set-impl(composer11, columnMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer11, currentCompositionLocalMap3, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer11, Integer.valueOf(hashCode3), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer11, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer11, materializeModifier3, ComposeUiNode.Companion.getSetModifier());
            int i8 = (i7 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart(composer8, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope3 = ColumnScopeInstance.INSTANCE;
            int i9 = ((0 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart(composer8, 1911269647, "C4310@271530L249,4316@271804L248:BillingScreen.kt#7ez3px");
            String upperCase = $item.getDisplayName().toUpperCase(Locale.ROOT);
            String str8 = "toUpperCase(...)";
            Intrinsics.checkNotNullExpressionValue(upperCase, "toUpperCase(...)");
            TextKt.Text-Nvy7gAk(upperCase, (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(18), (FontStyle) null, FontWeight.Companion.getBlack(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, composer8, 1597824, 0, 262058);
            TextKt.Text-Nvy7gAk("Customize your selection", (Modifier) null, ColorKt.getTextSecondary(), (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, composer8, 1597446, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd(composer8);
            ComposerKt.sourceInformationMarkerEnd(composer8);
            composer8.endNode();
            ComposerKt.sourceInformationMarkerEnd(composer8);
            ComposerKt.sourceInformationMarkerEnd(composer8);
            ComposerKt.sourceInformationMarkerEnd(composer8);
            IconButtonKt.IconButton($onDismiss, (Modifier) null, false, (IconButtonColors) null, (MutableInteractionSource) null, (Shape) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$596709634$app(), composer8, 1572864, 62);
            ComposerKt.sourceInformationMarkerEnd(composer8);
            ComposerKt.sourceInformationMarkerEnd(composer8);
            composer8.endNode();
            ComposerKt.sourceInformationMarkerEnd(composer8);
            ComposerKt.sourceInformationMarkerEnd(composer8);
            ComposerKt.sourceInformationMarkerEnd(composer8);
            SpacerKt.Spacer(SizeKt.height-3ABfNKs(Modifier.Companion, Dp.constructor-impl(16)), composer8, 6);
            Modifier verticalScroll$default = ScrollKt.verticalScroll$default(columnScope2.weight(Modifier.Companion, 1.0f, false), ScrollKt.rememberScrollState(0, composer8, 0, 1), false, (FlingBehavior) null, false, 14, (Object) null);
            ComposerKt.sourceInformationMarkerStart(composer8, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            ColumnScope columnScope4 = columnScope2;
            MeasurePolicy columnMeasurePolicy3 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), composer8, ((0 >> 3) & 14) | ((0 >> 3) & 112));
            Composer composer12 = composer8;
            ComposerKt.sourceInformationMarkerStart(composer12, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode4 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer12, 0));
            CompositionLocalMap currentCompositionLocalMap4 = composer12.getCurrentCompositionLocalMap();
            Modifier materializeModifier4 = ComposedModifierKt.materializeModifier(composer12, verticalScroll$default);
            Function0 constructor4 = ComposeUiNode.Companion.getConstructor();
            String str9 = "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo";
            int i10 = ((((0 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart(composer12, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!(composer12.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            composer12.startReusableNode();
            if (composer12.getInserting()) {
                function04 = constructor4;
                composer12.createNode(function04);
            } else {
                function04 = constructor4;
                composer12.useNode();
            }
            Composer composer13 = Updater.constructor-impl(composer12);
            Updater.set-impl(composer13, columnMeasurePolicy3, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer13, currentCompositionLocalMap4, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer13, Integer.valueOf(hashCode4), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer13, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer13, materializeModifier4, ComposeUiNode.Companion.getSetModifier());
            int i11 = (i10 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart(composer12, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope5 = ColumnScopeInstance.INSTANCE;
            int i12 = ((0 >> 6) & 112) | 6;
            Composer composer14 = composer12;
            Composer composer15 = composer12;
            ComposerKt.sourceInformationMarkerStart(composer14, 40720591, "C4407@277242L287,4421@277987L408,4416@277654L20,4414@277550L1029:BillingScreen.kt#7ez3px");
            composer14.startReplaceGroup(694049396);
            ComposerKt.sourceInformation(composer14, "*4337@272646L374,4404@277157L41");
            Iterator it = $itemOptionGroups.iterator();
            while (true) {
                String str10 = "CC(remember):BillingScreen.kt#9igjgp";
                if (!it.hasNext()) {
                    break;
                }
                MeasurePolicy measurePolicy = columnMeasurePolicy3;
                final OptionGroup optionGroup = (OptionGroup) it.next();
                String str11 = str6;
                String upperCase2 = optionGroup.getName().toUpperCase(Locale.ROOT);
                Intrinsics.checkNotNullExpressionValue(upperCase2, str8);
                String str12 = str8;
                Composer composer16 = composer14;
                Composer composer17 = composer12;
                TextKt.Text-Nvy7gAk(upperCase2 + " (Min: " + optionGroup.getMinSelectable() + ", Max: " + optionGroup.getMaxSelectable() + ")", PaddingKt.padding-VpY3zN4$default(Modifier.Companion, 0.0f, Dp.constructor-impl(8), 1, (Object) null), ColorKt.getTextSecondary(), (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, FontWeight.Companion.getBlack(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, composer16, 1597488, 0, 262056);
                List options = optionGroup.getOptions();
                if (options == null) {
                    options = CollectionsKt.emptyList();
                }
                composer16.startReplaceGroup(694065521);
                ComposerKt.sourceInformation(composer16, "*4347@273181L3925");
                for (List<OptionItem> list : CollectionsKt.chunked(options, 2)) {
                    Modifier modifier3 = verticalScroll$default;
                    Modifier modifier4 = PaddingKt.padding-VpY3zN4$default(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), 0.0f, Dp.constructor-impl(4), 1, (Object) null);
                    Arrangement.Horizontal horizontal4 = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(8));
                    ComposerKt.sourceInformationMarkerStart(composer16, 844473419, str7);
                    MeasurePolicy rowMeasurePolicy2 = RowKt.rowMeasurePolicy(horizontal4, Alignment.Companion.getTop(), composer16, ((54 >> 3) & 14) | ((54 >> 3) & 112));
                    Arrangement.Horizontal horizontal5 = horizontal4;
                    Composer composer18 = composer16;
                    ComposerKt.sourceInformationMarkerStart(composer18, -1159599143, str5);
                    int hashCode5 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer18, 0));
                    CompositionLocalMap currentCompositionLocalMap5 = composer18.getCurrentCompositionLocalMap();
                    String str13 = str7;
                    Modifier modifier5 = materializeModifier4;
                    Modifier modifier6 = modifier4;
                    Modifier materializeModifier5 = ComposedModifierKt.materializeModifier(composer18, modifier6);
                    Function0 constructor5 = ComposeUiNode.Companion.getConstructor();
                    int i13 = ((((54 << 3) & 112) << 6) & 896) | 6;
                    ComposerKt.sourceInformationMarkerStart(composer18, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                    if (!(composer18.getApplier() instanceof Applier)) {
                        ComposablesKt.invalidApplier();
                    }
                    composer18.startReusableNode();
                    if (composer18.getInserting()) {
                        function05 = constructor5;
                        composer18.createNode(function05);
                    } else {
                        function05 = constructor5;
                        composer18.useNode();
                    }
                    Composer composer19 = Updater.constructor-impl(composer18);
                    Updater.set-impl(composer19, rowMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
                    Updater.set-impl(composer19, currentCompositionLocalMap5, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                    Updater.init-impl(composer19, Integer.valueOf(hashCode5), ComposeUiNode.Companion.getSetCompositeKeyHash());
                    Updater.reconcile-impl(composer19, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                    Updater.set-impl(composer19, materializeModifier5, ComposeUiNode.Companion.getSetModifier());
                    int i14 = (i13 >> 6) & 14;
                    ComposerKt.sourceInformationMarkerStart(composer18, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
                    char c = 6;
                    int i15 = ((54 >> 6) & 112) | 6;
                    RowScope rowScope2 = RowScopeInstance.INSTANCE;
                    Composer composer20 = composer18;
                    ComposerKt.sourceInformationMarkerStart(composer20, 588478303, "C:BillingScreen.kt#7ez3px");
                    composer20.startReplaceGroup(1127362001);
                    ComposerKt.sourceInformation(composer20, "*4365@274372L1396,4355@273677L3197");
                    for (OptionItem optionItem2 : list) {
                        Iterable ItemCustomizationDialog$lambda$1 = ItemCustomizationDialog$lambda$1($selectedModifiers$delegate);
                        MeasurePolicy measurePolicy2 = rowMeasurePolicy2;
                        if ((ItemCustomizationDialog$lambda$1 instanceof Collection) && ((Collection) ItemCustomizationDialog$lambda$1).isEmpty()) {
                            r6 = 0;
                        } else {
                            Iterator it2 = ItemCustomizationDialog$lambda$1.iterator();
                            while (true) {
                                if (!it2.hasNext()) {
                                    r6 = 0;
                                    break;
                                }
                                SelectedModifier selectedModifier = (SelectedModifier) it2.next();
                                Iterator it3 = it2;
                                Iterable iterable = ItemCustomizationDialog$lambda$1;
                                if (Intrinsics.areEqual(selectedModifier.getName(), optionItem2.getName()) && selectedModifier.getGroupId() == optionGroup.getId()) {
                                    r6 = 1;
                                    break;
                                }
                                it2 = it3;
                                ItemCustomizationDialog$lambda$1 = iterable;
                            }
                        }
                        Iterable iterable2 = r6;
                        Composer composer21 = composer18;
                        Modifier modifier7 = modifier6;
                        double price = optionItem2.getPrice();
                        Modifier modifier8 = materializeModifier5;
                        Function0 function07 = function0;
                        Composer composer22 = composer8;
                        Modifier modifier9 = BorderKt.border-xT4_qwU(BackgroundKt.background-bw27NRU$default(ClipKt.clip(RowScope.weight$default(rowScope2, Modifier.Companion, 1.0f, false, 2, (Object) null), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(12))), iterable2 != null ? ColorKt.getSaSGreen() : ColorKt.getInputDark(), (Shape) null, 2, (Object) null), Dp.constructor-impl(1), iterable2 != null ? ColorKt.getSaSGreen() : ColorKt.getCardBorderDark(), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(12)));
                        ComposerKt.sourceInformationMarkerStart(composer20, -48361699, str10);
                        boolean changedInstance = composer20.changedInstance(optionGroup) | composer20.changed(optionItem2) | composer20.changed(price) | composer20.changedInstance($context);
                        Composer composer23 = composer20;
                        Object rememberedValue = composer23.rememberedValue();
                        if (changedInstance || rememberedValue == Composer.Companion.getEmpty()) {
                            String str14 = str10;
                            optionItem = optionItem2;
                            composer2 = composer7;
                            str = str9;
                            composer3 = composer15;
                            horizontal = horizontal3;
                            horizontal2 = horizontal5;
                            columnScope = columnScope4;
                            str2 = str14;
                            Composer composer24 = composer9;
                            composer4 = composer20;
                            d = price;
                            str3 = str11;
                            str4 = str12;
                            composer5 = composer24;
                            obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda0
                                public final Object invoke() {
                                    Unit ItemCustomizationDialog$lambda$7$0$0$1$0$0$0$0$1$0;
                                    ItemCustomizationDialog$lambda$7$0$0$1$0$0$0$0$1$0 = BillingScreenKt.ItemCustomizationDialog$lambda$7$0$0$1$0$0$0$0$1$0(optionGroup, optionItem, d, $context, $selectedModifiers$delegate);
                                    return ItemCustomizationDialog$lambda$7$0$0$1$0$0$0$0$1$0;
                                }
                            };
                            composer23.updateRememberedValue(obj);
                        } else {
                            Composer composer25 = composer9;
                            composer4 = composer20;
                            d = price;
                            str3 = str11;
                            composer5 = composer25;
                            composer2 = composer7;
                            str = str9;
                            composer3 = composer15;
                            str4 = str12;
                            horizontal = horizontal3;
                            horizontal2 = horizontal5;
                            columnScope = columnScope4;
                            str2 = str10;
                            optionItem = optionItem2;
                            obj = rememberedValue;
                        }
                        ComposerKt.sourceInformationMarkerEnd(composer4);
                        Modifier modifier10 = PaddingKt.padding-3ABfNKs(ClickableKt.clickable-oSLSa3U$default(modifier9, false, (String) null, (Role) null, (MutableInteractionSource) null, (Function0) obj, 15, (Object) null), Dp.constructor-impl(12));
                        Composer composer26 = composer4;
                        OptionGroup optionGroup2 = optionGroup;
                        ComposerKt.sourceInformationMarkerStart(composer26, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                        MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(Alignment.Companion.getTopStart(), false);
                        ComposerKt.sourceInformationMarkerStart(composer26, -1159599143, str5);
                        int hashCode6 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer26, 0));
                        CompositionLocalMap currentCompositionLocalMap6 = composer26.getCurrentCompositionLocalMap();
                        OptionItem optionItem3 = optionItem;
                        double d2 = d;
                        Modifier materializeModifier6 = ComposedModifierKt.materializeModifier(composer26, modifier10);
                        Function0 constructor6 = ComposeUiNode.Companion.getConstructor();
                        int i16 = ((((0 << 3) & 112) << 6) & 896) | 6;
                        ComposerKt.sourceInformationMarkerStart(composer26, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                        if (!(composer26.getApplier() instanceof Applier)) {
                            ComposablesKt.invalidApplier();
                        }
                        composer26.startReusableNode();
                        if (composer26.getInserting()) {
                            composer26.createNode(constructor6);
                        } else {
                            composer26.useNode();
                        }
                        Composer composer27 = Updater.constructor-impl(composer26);
                        Updater.set-impl(composer27, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
                        Updater.set-impl(composer27, currentCompositionLocalMap6, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                        Updater.init-impl(composer27, Integer.valueOf(hashCode6), ComposeUiNode.Companion.getSetCompositeKeyHash());
                        Updater.reconcile-impl(composer27, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                        Updater.set-impl(composer27, materializeModifier6, ComposeUiNode.Companion.getSetModifier());
                        int i17 = (i16 >> 6) & 14;
                        ComposerKt.sourceInformationMarkerStart(composer26, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                        BoxScope boxScope = BoxScopeInstance.INSTANCE;
                        int i18 = ((0 >> 6) & 112) | 6;
                        ComposerKt.sourceInformationMarkerStart(composer26, -1981898143, "C4383@275909L927:BillingScreen.kt#7ez3px");
                        ComposerKt.sourceInformationMarkerStart(composer26, 1341605231, str);
                        Modifier modifier11 = Modifier.Companion;
                        MeasurePolicy columnMeasurePolicy4 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), composer26, ((0 >> 3) & 14) | ((0 >> 3) & 112));
                        ComposerKt.sourceInformationMarkerStart(composer26, -1159599143, str5);
                        int hashCode7 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer26, 0));
                        String str15 = str5;
                        CompositionLocalMap currentCompositionLocalMap7 = composer26.getCurrentCompositionLocalMap();
                        Modifier materializeModifier7 = ComposedModifierKt.materializeModifier(composer26, modifier11);
                        Function0 constructor7 = ComposeUiNode.Companion.getConstructor();
                        int i19 = ((((0 << 3) & 112) << 6) & 896) | 6;
                        ComposerKt.sourceInformationMarkerStart(composer26, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                        if (!(composer26.getApplier() instanceof Applier)) {
                            ComposablesKt.invalidApplier();
                        }
                        composer26.startReusableNode();
                        if (composer26.getInserting()) {
                            function06 = constructor7;
                            composer26.createNode(function06);
                        } else {
                            function06 = constructor7;
                            composer26.useNode();
                        }
                        Composer composer28 = Updater.constructor-impl(composer26);
                        Updater.set-impl(composer28, columnMeasurePolicy4, ComposeUiNode.Companion.getSetMeasurePolicy());
                        Updater.set-impl(composer28, currentCompositionLocalMap7, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                        Updater.init-impl(composer28, Integer.valueOf(hashCode7), ComposeUiNode.Companion.getSetCompositeKeyHash());
                        Updater.reconcile-impl(composer28, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                        Updater.set-impl(composer28, materializeModifier7, ComposeUiNode.Companion.getSetModifier());
                        int i20 = (i19 >> 6) & 14;
                        ComposerKt.sourceInformationMarkerStart(composer26, 2093002350, str3);
                        ColumnScope columnScope6 = ColumnScopeInstance.INSTANCE;
                        int i21 = ((0 >> 6) & 112) | 6;
                        ComposerKt.sourceInformationMarkerStart(composer26, -1584015274, "C4384@275962L340,4390@276347L447:BillingScreen.kt#7ez3px");
                        String upperCase3 = optionItem3.getName().toUpperCase(Locale.ROOT);
                        Intrinsics.checkNotNullExpressionValue(upperCase3, str4);
                        TextKt.Text-Nvy7gAk(upperCase3, (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, composer26, 1597824, 0, 262058);
                        StringCompanionObject stringCompanionObject = StringCompanionObject.INSTANCE;
                        String format = String.format(Locale.US, "%.2f", Arrays.copyOf(new Object[]{Double.valueOf(d2)}, 1));
                        Intrinsics.checkNotNullExpressionValue(format, "format(...)");
                        TextKt.Text-Nvy7gAk("+ " + $currency + " " + format, (Modifier) null, iterable2 != null ? Color.copy-wmQWz5c$default(Color.Companion.getWhite-0d7_KjU(), 0.8f, 0.0f, 0.0f, 0.0f, 14, (Object) null) : ColorKt.getTextSecondary(), (TextAutoSize) null, TextUnitKt.getSp(9), (FontStyle) null, FontWeight.Companion.getMedium(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, composer26, 1597440, 0, 262058);
                        ComposerKt.sourceInformationMarkerEnd(composer26);
                        ComposerKt.sourceInformationMarkerEnd(composer26);
                        composer26.endNode();
                        ComposerKt.sourceInformationMarkerEnd(composer26);
                        ComposerKt.sourceInformationMarkerEnd(composer26);
                        ComposerKt.sourceInformationMarkerEnd(composer26);
                        ComposerKt.sourceInformationMarkerEnd(composer26);
                        ComposerKt.sourceInformationMarkerEnd(composer26);
                        composer26.endNode();
                        ComposerKt.sourceInformationMarkerEnd(composer26);
                        ComposerKt.sourceInformationMarkerEnd(composer26);
                        ComposerKt.sourceInformationMarkerEnd(composer26);
                        str10 = str2;
                        str12 = str4;
                        columnScope4 = columnScope;
                        horizontal5 = horizontal2;
                        composer20 = composer4;
                        horizontal3 = horizontal;
                        optionGroup = optionGroup2;
                        composer9 = composer5;
                        rowMeasurePolicy2 = measurePolicy2;
                        composer18 = composer21;
                        str5 = str15;
                        function0 = function07;
                        composer8 = composer22;
                        str11 = str3;
                        str9 = str;
                        composer15 = composer3;
                        modifier6 = modifier7;
                        materializeModifier5 = modifier8;
                        composer7 = composer2;
                        c = 6;
                    }
                    String str16 = str5;
                    String str17 = str10;
                    Composer composer29 = composer8;
                    Composer composer30 = composer18;
                    Function0 function08 = function0;
                    Composer composer31 = composer7;
                    String str18 = str9;
                    Composer composer32 = composer15;
                    String str19 = str11;
                    String str20 = str12;
                    OptionGroup optionGroup3 = optionGroup;
                    Alignment.Horizontal horizontal6 = horizontal3;
                    Composer composer33 = composer9;
                    Composer composer34 = composer20;
                    ColumnScope columnScope7 = columnScope4;
                    composer34.endReplaceGroup();
                    if (list.size() < 2) {
                        composer = composer34;
                        composer.startReplaceGroup(591880242);
                        ComposerKt.sourceInformation(composer, "4400@277004L38");
                        SpacerKt.Spacer(RowScope.weight$default(rowScope2, Modifier.Companion, 1.0f, false, 2, (Object) null), composer, 0);
                        composer.endReplaceGroup();
                    } else {
                        composer = composer34;
                        composer.startReplaceGroup(591985952);
                        composer.endReplaceGroup();
                    }
                    ComposerKt.sourceInformationMarkerEnd(composer);
                    ComposerKt.sourceInformationMarkerEnd(composer18);
                    composer18.endNode();
                    ComposerKt.sourceInformationMarkerEnd(composer18);
                    ComposerKt.sourceInformationMarkerEnd(composer30);
                    ComposerKt.sourceInformationMarkerEnd(composer16);
                    str10 = str17;
                    str12 = str20;
                    columnScope4 = columnScope7;
                    horizontal3 = horizontal6;
                    optionGroup = optionGroup3;
                    composer9 = composer33;
                    verticalScroll$default = modifier3;
                    str5 = str16;
                    function0 = function08;
                    composer8 = composer29;
                    str11 = str19;
                    str9 = str18;
                    composer15 = composer32;
                    str7 = str13;
                    materializeModifier4 = modifier5;
                    composer7 = composer31;
                }
                composer16.endReplaceGroup();
                SpacerKt.Spacer(SizeKt.height-3ABfNKs(Modifier.Companion, Dp.constructor-impl(12)), composer16, 6);
                composer14 = composer16;
                str8 = str12;
                str6 = str11;
                composer15 = composer15;
                str7 = str7;
                columnMeasurePolicy3 = measurePolicy;
                composer12 = composer17;
                verticalScroll$default = verticalScroll$default;
                str5 = str5;
                str9 = str9;
                composer7 = composer7;
                materializeModifier4 = materializeModifier4;
            }
            Composer composer35 = composer8;
            Composer composer36 = composer12;
            Composer composer37 = composer7;
            Composer composer38 = composer9;
            Composer composer39 = composer15;
            Composer composer40 = composer14;
            composer40.endReplaceGroup();
            TextKt.Text-Nvy7gAk("KITCHEN NOTE", PaddingKt.padding-VpY3zN4$default(Modifier.Companion, 0.0f, Dp.constructor-impl(8), 1, (Object) null), ColorKt.getTextSecondary(), (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, FontWeight.Companion.getBlack(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, composer40, 1597494, 0, 262056);
            String ItemCustomizationDialog$lambda$4 = ItemCustomizationDialog$lambda$4($kitchenNote$delegate);
            Modifier modifier12 = SizeKt.height-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(75));
            TextFieldColors textFieldColors = OutlinedTextFieldDefaults.INSTANCE.colors-0hiis_0(Color.Companion.getWhite-0d7_KjU(), Color.Companion.getWhite-0d7_KjU(), 0L, 0L, ColorKt.getInputDark(), ColorKt.getInputDark(), 0L, 0L, 0L, 0L, (TextSelectionColors) null, ColorKt.getSaSGreen(), ColorKt.getCardBorderDark(), 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, composer40, 54, 0, 0, 0, 3072, 2147477452, 4095);
            Shape shape = RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(12));
            TextStyle textStyle = new TextStyle(0L, TextUnitKt.getSp(11), (FontWeight) null, (FontStyle) null, (FontSynthesis) null, (FontFamily) null, (String) null, 0L, (BaselineShift) null, (TextGeometricTransform) null, (LocaleList) null, 0L, (TextDecoration) null, (Shadow) null, (DrawStyle) null, 0, 0, 0L, (TextIndent) null, (PlatformTextStyle) null, (LineHeightStyle) null, 0, 0, (TextMotion) null, 16777213, (DefaultConstructorMarker) null);
            ComposerKt.sourceInformationMarkerStart(composer40, 694206338, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue2 = composer40.rememberedValue();
            if (rememberedValue2 == Composer.Companion.getEmpty()) {
                mutableState = $kitchenNote$delegate;
                Object obj2 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda1
                    public final Object invoke(Object obj3) {
                        Unit ItemCustomizationDialog$lambda$7$0$0$1$1$0;
                        ItemCustomizationDialog$lambda$7$0$0$1$1$0 = BillingScreenKt.ItemCustomizationDialog$lambda$7$0$0$1$1$0(mutableState, (String) obj3);
                        return ItemCustomizationDialog$lambda$7$0$0$1$1$0;
                    }
                };
                composer40.updateRememberedValue(obj2);
                rememberedValue2 = obj2;
            } else {
                mutableState = $kitchenNote$delegate;
            }
            ComposerKt.sourceInformationMarkerEnd(composer40);
            OutlinedTextFieldKt.OutlinedTextField(ItemCustomizationDialog$lambda$4, (Function1) rememberedValue2, modifier12, false, false, textStyle, (Function2) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$308535477$app(), (Function2) null, (Function2) null, (Function2) null, (Function2) null, (Function2) null, false, (VisualTransformation) null, (KeyboardOptions) null, (KeyboardActions) null, false, 2, 0, (MutableInteractionSource) null, shape, textFieldColors, composer40, 12779952, 100663296, 0, 1834840);
            ComposerKt.sourceInformationMarkerEnd(composer40);
            ComposerKt.sourceInformationMarkerEnd(composer39);
            composer12.endNode();
            ComposerKt.sourceInformationMarkerEnd(composer12);
            ComposerKt.sourceInformationMarkerEnd(composer36);
            ComposerKt.sourceInformationMarkerEnd(composer8);
            SpacerKt.Spacer(SizeKt.height-3ABfNKs(Modifier.Companion, Dp.constructor-impl(16)), composer35, 6);
            ComposerKt.sourceInformationMarkerStart(composer35, 2093882009, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance2 = composer35.changedInstance($itemOptionGroups) | composer35.changedInstance($context) | composer35.changed($onAdd);
            Object rememberedValue3 = composer35.rememberedValue();
            if (changedInstance2 || rememberedValue3 == Composer.Companion.getEmpty()) {
                final MutableState mutableState2 = mutableState;
                Object obj3 = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda2
                    public final Object invoke() {
                        Unit ItemCustomizationDialog$lambda$7$0$0$2$0;
                        ItemCustomizationDialog$lambda$7$0$0$2$0 = BillingScreenKt.ItemCustomizationDialog$lambda$7$0$0$2$0($itemOptionGroups, $context, $onAdd, $selectedModifiers$delegate, mutableState2);
                        return ItemCustomizationDialog$lambda$7$0$0$2$0;
                    }
                };
                composer35.updateRememberedValue(obj3);
                rememberedValue3 = obj3;
            }
            ComposerKt.sourceInformationMarkerEnd(composer35);
            ButtonKt.Button((Function0) rememberedValue3, SizeKt.height-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(48)), false, RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(14)), ButtonDefaults.INSTANCE.buttonColors-ro_MJ88(ColorKt.getSaSGreen(), 0L, 0L, 0L, composer35, ButtonDefaults.$stable << 12, 14), (ButtonElevation) null, (BorderStroke) null, (PaddingValues) null, (MutableInteractionSource) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$1960919636$app(), composer35, 805306416, 484);
            ComposerKt.sourceInformationMarkerEnd(composer35);
            ComposerKt.sourceInformationMarkerEnd(composer37);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd(composer38);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit ItemCustomizationDialog$lambda$7$0$0$1$0$0$0$0$1$0(OptionGroup $og, OptionItem $opt, double $optionPrice, Context $context, MutableState $selectedModifiers$delegate) {
        boolean exists;
        Iterable ItemCustomizationDialog$lambda$1 = ItemCustomizationDialog$lambda$1($selectedModifiers$delegate);
        Collection arrayList = new ArrayList();
        for (Object obj : ItemCustomizationDialog$lambda$1) {
            if (((SelectedModifier) obj).getGroupId() == $og.getId()) {
                arrayList.add(obj);
            }
        }
        List sameGroupMods = (List) arrayList;
        Iterable ItemCustomizationDialog$lambda$12 = ItemCustomizationDialog$lambda$1($selectedModifiers$delegate);
        if (!(ItemCustomizationDialog$lambda$12 instanceof Collection) || !((Collection) ItemCustomizationDialog$lambda$12).isEmpty()) {
            Iterator it = ItemCustomizationDialog$lambda$12.iterator();
            while (true) {
                if (it.hasNext()) {
                    SelectedModifier selectedModifier = (SelectedModifier) it.next();
                    if (Intrinsics.areEqual(selectedModifier.getName(), $opt.getName()) && selectedModifier.getGroupId() == $og.getId()) {
                        exists = true;
                        break;
                    }
                } else {
                    exists = false;
                    break;
                }
            }
        } else {
            exists = false;
        }
        if (exists) {
            Iterable ItemCustomizationDialog$lambda$13 = ItemCustomizationDialog$lambda$1($selectedModifiers$delegate);
            Collection arrayList2 = new ArrayList();
            for (Object obj2 : ItemCustomizationDialog$lambda$13) {
                SelectedModifier selectedModifier2 = (SelectedModifier) obj2;
                if (!(Intrinsics.areEqual(selectedModifier2.getName(), $opt.getName()) && selectedModifier2.getGroupId() == $og.getId())) {
                    arrayList2.add(obj2);
                }
            }
            $selectedModifiers$delegate.setValue((List) arrayList2);
        } else if ($og.getMaxSelectable() == 1) {
            Iterable ItemCustomizationDialog$lambda$14 = ItemCustomizationDialog$lambda$1($selectedModifiers$delegate);
            Collection arrayList3 = new ArrayList();
            for (Object obj3 : ItemCustomizationDialog$lambda$14) {
                if (!(((SelectedModifier) obj3).getGroupId() == $og.getId())) {
                    arrayList3.add(obj3);
                }
            }
            $selectedModifiers$delegate.setValue(CollectionsKt.plus((List) arrayList3, new SelectedModifier($opt.getName(), $optionPrice, $og.getId())));
        } else if (sameGroupMods.size() >= $og.getMaxSelectable()) {
            Toast.makeText($context, "Max " + $og.getMaxSelectable() + " options allowed for " + $og.getName(), 0).show();
        } else {
            $selectedModifiers$delegate.setValue(CollectionsKt.plus(ItemCustomizationDialog$lambda$1($selectedModifiers$delegate), new SelectedModifier($opt.getName(), $optionPrice, $og.getId())));
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit ItemCustomizationDialog$lambda$7$0$0$1$1$0(MutableState $kitchenNote$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $kitchenNote$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit ItemCustomizationDialog$lambda$7$0$0$2$0(List $itemOptionGroups, Context $context, Function2 $onAdd, MutableState $selectedModifiers$delegate, MutableState $kitchenNote$delegate) {
        Iterator it = $itemOptionGroups.iterator();
        while (it.hasNext()) {
            OptionGroup og = (OptionGroup) it.next();
            Iterable ItemCustomizationDialog$lambda$1 = ItemCustomizationDialog$lambda$1($selectedModifiers$delegate);
            Collection arrayList = new ArrayList();
            Iterator it2 = ItemCustomizationDialog$lambda$1.iterator();
            while (true) {
                if (!it2.hasNext()) {
                    break;
                }
                Object next = it2.next();
                if (((SelectedModifier) next).getGroupId() == og.getId()) {
                    arrayList.add(next);
                }
            }
            List sameGroupMods = (List) arrayList;
            if (sameGroupMods.size() < og.getMinSelectable()) {
                Toast.makeText($context, "Please select at least " + og.getMinSelectable() + " option(s) for " + og.getName(), 1).show();
                return Unit.INSTANCE;
            }
        }
        $onAdd.invoke(ItemCustomizationDialog$lambda$1($selectedModifiers$delegate), ItemCustomizationDialog$lambda$4($kitchenNote$delegate));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Triple<String, String, String> parsePhoneNumber(String fullPhone) {
        String cleanPhone = StringsKt.trim(fullPhone).toString();
        List<CountryCodeItem> sortedCodes = CollectionsKt.sortedWith(countryCodes, new BillingScreenKt$parsePhoneNumber$.inlined.sortedByDescending.1());
        for (CountryCodeItem country : sortedCodes) {
            if (StringsKt.startsWith$default(cleanPhone, country.getDialCode(), false, 2, (Object) null)) {
                String code = country.getCode();
                String flag = country.getFlag();
                String substring = cleanPhone.substring(country.getDialCode().length());
                Intrinsics.checkNotNullExpressionValue(substring, "substring(...)");
                return new Triple<>(code, flag, substring);
            }
            String dialCodeNoPlus = StringsKt.removePrefix(country.getDialCode(), "+");
            if (StringsKt.startsWith$default(cleanPhone, dialCodeNoPlus, false, 2, (Object) null)) {
                String code2 = country.getCode();
                String flag2 = country.getFlag();
                String substring2 = cleanPhone.substring(dialCodeNoPlus.length());
                Intrinsics.checkNotNullExpressionValue(substring2, "substring(...)");
                return new Triple<>(code2, flag2, substring2);
            }
        }
        return new Triple<>("IN", "🇮🇳", cleanPhone);
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    /* renamed from: CompactTextField-03iij_k, reason: not valid java name */
    private static final void m86CompactTextField03iij_k(final String value, final Function1<? super String, Unit> function1, final String placeholder, Modifier modifier, KeyboardOptions keyboardOptions, boolean singleLine, long fontSize, CornerBasedShape shape, Composer $composer, final int $changed, final int i) {
        String str;
        Function1<? super String, Unit> function12;
        Modifier modifier2;
        KeyboardOptions keyboardOptions2;
        boolean singleLine2;
        int i2;
        long fontSize2;
        Composer $composer2;
        final KeyboardOptions keyboardOptions3;
        final long fontSize3;
        final CornerBasedShape shape2;
        final Modifier modifier3;
        final boolean singleLine3;
        CornerBasedShape shape3;
        long fontSize4;
        boolean singleLine4;
        int $dirty;
        KeyboardOptions keyboardOptions4;
        int i3;
        Composer $composer3 = $composer.startRestartGroup(-2121916777);
        ComposerKt.sourceInformation($composer3, "C(CompactTextField)N(value,onValueChange,placeholder,modifier,keyboardOptions,singleLine,fontSize:c#ui.unit.TextUnit,shape)4525@282680L11,4526@282743L11,4527@282806L11,4528@282872L11,4542@283412L609,4530@282897L1130:BillingScreen.kt#7ez3px");
        int $dirty2 = $changed;
        if (($changed & 6) == 0) {
            str = value;
            $dirty2 |= $composer3.changed(str) ? 4 : 2;
        } else {
            str = value;
        }
        if (($changed & 48) == 0) {
            function12 = function1;
            $dirty2 |= $composer3.changedInstance(function12) ? 32 : 16;
        } else {
            function12 = function1;
        }
        if (($changed & 384) == 0) {
            $dirty2 |= $composer3.changed(placeholder) ? 256 : 128;
        }
        int i4 = i & 8;
        if (i4 != 0) {
            $dirty2 |= 3072;
            modifier2 = modifier;
        } else if (($changed & 3072) == 0) {
            modifier2 = modifier;
            $dirty2 |= $composer3.changed(modifier2) ? 2048 : 1024;
        } else {
            modifier2 = modifier;
        }
        int i5 = i & 16;
        if (i5 != 0) {
            $dirty2 |= 24576;
            keyboardOptions2 = keyboardOptions;
        } else if (($changed & 24576) == 0) {
            keyboardOptions2 = keyboardOptions;
            $dirty2 |= $composer3.changed(keyboardOptions2) ? 16384 : 8192;
        } else {
            keyboardOptions2 = keyboardOptions;
        }
        int i6 = i & 32;
        if (i6 != 0) {
            $dirty2 |= 196608;
            singleLine2 = singleLine;
        } else if ((196608 & $changed) == 0) {
            singleLine2 = singleLine;
            $dirty2 |= $composer3.changed(singleLine2) ? 131072 : 65536;
        } else {
            singleLine2 = singleLine;
        }
        int i7 = i & 64;
        if (i7 != 0) {
            $dirty2 |= 1572864;
            i2 = i4;
            fontSize2 = fontSize;
        } else if (($changed & 1572864) == 0) {
            i2 = i4;
            fontSize2 = fontSize;
            $dirty2 |= $composer3.changed(fontSize2) ? 1048576 : 524288;
        } else {
            i2 = i4;
            fontSize2 = fontSize;
        }
        if (($changed & 12582912) == 0) {
            if ((i & 128) == 0 && $composer3.changed(shape)) {
                i3 = 8388608;
                $dirty2 |= i3;
            }
            i3 = 4194304;
            $dirty2 |= i3;
        }
        int $dirty3 = $dirty2;
        if (!$composer3.shouldExecute(($dirty2 & 4793491) != 4793490, $dirty3 & 1)) {
            $composer2 = $composer3;
            $composer2.skipToGroupEnd();
            keyboardOptions3 = keyboardOptions2;
            fontSize3 = fontSize2;
            shape2 = shape;
            modifier3 = modifier2;
            singleLine3 = singleLine2;
        } else {
            $composer3.startDefaults();
            if (($changed & 1) != 0 && !$composer3.getDefaultsInvalid()) {
                $composer3.skipToGroupEnd();
                if ((i & 128) != 0) {
                    $dirty = $dirty3 & (-29360129);
                    fontSize4 = fontSize2;
                    keyboardOptions4 = keyboardOptions2;
                    singleLine4 = singleLine2;
                    shape3 = shape;
                } else {
                    shape3 = shape;
                    fontSize4 = fontSize2;
                    singleLine4 = singleLine2;
                    $dirty = $dirty3;
                    keyboardOptions4 = keyboardOptions2;
                }
            } else {
                if (i2 != 0) {
                    modifier2 = (Modifier) Modifier.Companion;
                }
                if (i5 != 0) {
                    keyboardOptions2 = KeyboardOptions.Companion.getDefault();
                }
                if (i6 != 0) {
                    singleLine2 = true;
                }
                if (i7 != 0) {
                    fontSize2 = TextUnitKt.getSp(11);
                }
                if ((i & 128) == 0) {
                    shape3 = shape;
                    fontSize4 = fontSize2;
                    singleLine4 = singleLine2;
                    $dirty = $dirty3;
                    keyboardOptions4 = keyboardOptions2;
                } else {
                    shape3 = (CornerBasedShape) RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(18));
                    $dirty = $dirty3 & (-29360129);
                    fontSize4 = fontSize2;
                    keyboardOptions4 = keyboardOptions2;
                    singleLine4 = singleLine2;
                }
            }
            $composer3.endDefaults();
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-2121916777, $dirty, -1, "com.example.sasloopmanager.CompactTextField (BillingScreen.kt:4524)");
            }
            long TextPrimary = MaterialTheme.INSTANCE.getColorScheme($composer3, MaterialTheme.$stable).getOnBackground-0d7_KjU();
            final long TextSecondary = MaterialTheme.INSTANCE.getColorScheme($composer3, MaterialTheme.$stable).getOnSurfaceVariant-0d7_KjU();
            long InputDark = MaterialTheme.INSTANCE.getColorScheme($composer3, MaterialTheme.$stable).getSurfaceVariant-0d7_KjU();
            long CardBorderDark = MaterialTheme.INSTANCE.getColorScheme($composer3, MaterialTheme.$stable).getOutline-0d7_KjU();
            CornerBasedShape shape4 = shape3;
            int $dirty4 = $dirty;
            final String str2 = str;
            final long fontSize5 = fontSize4;
            $composer2 = $composer3;
            BasicTextFieldKt.BasicTextField(value, function12, PaddingKt.padding-VpY3zN4$default(BorderKt.border-xT4_qwU(BackgroundKt.background-bw27NRU(SizeKt.height-3ABfNKs(modifier2, Dp.constructor-impl(40)), InputDark, (Shape) shape3), Dp.constructor-impl(1), CardBorderDark, (Shape) shape4), Dp.constructor-impl(12), 0.0f, 2, (Object) null), false, false, new TextStyle(TextPrimary, fontSize4, FontWeight.Companion.getMedium(), (FontStyle) null, (FontSynthesis) null, (FontFamily) null, (String) null, 0L, (BaselineShift) null, (TextGeometricTransform) null, (LocaleList) null, 0L, (TextDecoration) null, (Shadow) null, (DrawStyle) null, 0, 0, 0L, (TextIndent) null, (PlatformTextStyle) null, (LineHeightStyle) null, 0, 0, (TextMotion) null, 16777208, (DefaultConstructorMarker) null), keyboardOptions4, (KeyboardActions) null, singleLine4, 0, 0, (VisualTransformation) null, (Function1) null, (MutableInteractionSource) null, new SolidColor(ColorKt.getSaSGreen(), (DefaultConstructorMarker) null), ComposableLambdaKt.rememberComposableLambda(-1064281324, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda78
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    return BillingScreenKt.CompactTextField_03iij_k$lambda$0(str2, placeholder, TextSecondary, fontSize5, (Function2) obj, (Composer) obj2, ((Integer) obj3).intValue());
                }
            }, $composer3, 54), $composer2, ($dirty4 & 14) | ($dirty4 & 112) | (3670016 & ($dirty4 << 6)) | (($dirty4 << 9) & 234881024), 196608, 16024);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
            modifier3 = modifier2;
            keyboardOptions3 = keyboardOptions4;
            singleLine3 = singleLine4;
            shape2 = shape4;
            fontSize3 = fontSize5;
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope(new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda79
                public final Object invoke(Object obj, Object obj2) {
                    return BillingScreenKt.CompactTextField_03iij_k$lambda$1(value, function1, placeholder, modifier3, keyboardOptions3, singleLine3, fontSize3, shape2, $changed, i, (Composer) obj, ((Integer) obj2).intValue());
                }
            });
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    @Composable
    @ComposableInferredTarget(scheme = "[androidx.compose.ui.UiComposable[androidx.compose.ui.UiComposable]]")
    public static final Unit CompactTextField_03iij_k$lambda$0(String $value, String $placeholder, long $TextSecondary, long $fontSize, Function2 innerTextField, Composer $composer, int $changed) {
        Function0 function0;
        Intrinsics.checkNotNullParameter(innerTextField, "innerTextField");
        ComposerKt.sourceInformation($composer, "CN(innerTextField)4543@283444L567:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            $dirty |= $composer.changedInstance(innerTextField) ? 4 : 2;
        }
        if ($composer.shouldExecute(($dirty & 19) != 18, $dirty & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1064281324, $dirty, -1, "com.example.sasloopmanager.CompactTextField.<anonymous> (BillingScreen.kt:4543)");
            }
            Modifier fillMaxSize$default = SizeKt.fillMaxSize$default(Modifier.Companion, 0.0f, 1, (Object) null);
            Alignment centerStart = Alignment.Companion.getCenterStart();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(centerStart, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, fillMaxSize$default);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int $dirty2 = $dirty;
            int i = ((((54 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i3 = ((54 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -1721972271, "C4557@283981L16:BillingScreen.kt#7ez3px");
            if ($value.length() == 0) {
                $composer.startReplaceGroup(-1721932530);
                ComposerKt.sourceInformation($composer, "4548@283632L314");
                TextKt.Text-Nvy7gAk($placeholder, (Modifier) null, $TextSecondary, (TextAutoSize) null, $fontSize, (FontStyle) null, FontWeight.Companion.getMedium(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, TextOverflow.Companion.getEllipsis-gIe3tQ8(), false, 1, 0, (Function1) null, (TextStyle) null, $composer, 1572864, 24960, 241578);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(-1721612920);
                $composer.endReplaceGroup();
            }
            innerTextField.invoke($composer, Integer.valueOf($dirty2 & 14));
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final void ThermalGridRow(final String left, String right, Composer $composer, final int $changed) {
        final String str;
        Composer $composer2;
        Composer $composer3 = $composer.startRestartGroup(592293593);
        ComposerKt.sourceInformation($composer3, "C(ThermalGridRow)N(left,right)4565@284105L290:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            $dirty |= $composer3.changed(left) ? 4 : 2;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer3.changed(right) ? 32 : 16;
        }
        if (!$composer3.shouldExecute(($dirty & 19) != 18, $dirty & 1)) {
            str = right;
            $composer2 = $composer3;
            $composer2.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(592293593, $dirty, -1, "com.example.sasloopmanager.ThermalGridRow (BillingScreen.kt:4564)");
            }
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null);
            Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer3, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, centerVertically, $composer3, ((438 >> 3) & 14) | ((438 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer3, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer3, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer3.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer3, fillMaxWidth$default);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = ((((438 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer3, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer3.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer3.startReusableNode();
            if ($composer3.getInserting()) {
                $composer3.createNode(constructor);
            } else {
                $composer3.useNode();
            }
            Composer composer = Updater.constructor-impl($composer3);
            Updater.set-impl(composer, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer3, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope = RowScopeInstance.INSTANCE;
            int i3 = ((438 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer3, 94740612, "C4570@284283L48,4571@284340L49:BillingScreen.kt#7ez3px");
            $composer2 = $composer3;
            TextKt.Text-Nvy7gAk(left, (Modifier) null, Color.Companion.getBlack-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(9), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer3, ($dirty & 14) | 24960, 0, 262122);
            str = right;
            TextKt.Text-Nvy7gAk(str, (Modifier) null, Color.Companion.getBlack-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(9), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer3, (($dirty >> 3) & 14) | 24960, 0, 262122);
            ComposerKt.sourceInformationMarkerEnd($composer3);
            ComposerKt.sourceInformationMarkerEnd($composer3);
            $composer3.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer3);
            ComposerKt.sourceInformationMarkerEnd($composer3);
            ComposerKt.sourceInformationMarkerEnd($composer3);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope(new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda69
                public final Object invoke(Object obj, Object obj2) {
                    return BillingScreenKt.ThermalGridRow$lambda$1(left, str, $changed, (Composer) obj, ((Integer) obj2).intValue());
                }
            });
        }
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    /* renamed from: ThermalReceiptRow-JHQioms, reason: not valid java name */
    private static final void m89ThermalReceiptRowJHQioms(final String label, final String value, boolean isBold, long fontSize, Composer $composer, final int $changed, final int i) {
        String str;
        boolean z;
        long fontSize2;
        final boolean isBold2;
        final long fontSize3;
        boolean isBold3;
        Function0 function0;
        Composer $composer2 = $composer.startRestartGroup(46195100);
        ComposerKt.sourceInformation($composer2, "C(ThermalReceiptRow)N(label,value,isBold,fontSize:c#ui.unit.TextUnit)4582@284572L744:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            str = label;
            $dirty |= $composer2.changed(str) ? 4 : 2;
        } else {
            str = label;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer2.changed(value) ? 32 : 16;
        }
        int i2 = i & 4;
        if (i2 != 0) {
            $dirty |= 384;
            z = isBold;
        } else if (($changed & 384) == 0) {
            z = isBold;
            $dirty |= $composer2.changed(z) ? 256 : 128;
        } else {
            z = isBold;
        }
        int i3 = i & 8;
        if (i3 != 0) {
            $dirty |= 3072;
            fontSize2 = fontSize;
        } else if (($changed & 3072) == 0) {
            fontSize2 = fontSize;
            $dirty |= $composer2.changed(fontSize2) ? 2048 : 1024;
        } else {
            fontSize2 = fontSize;
        }
        if ($composer2.shouldExecute(($dirty & 1171) != 1170, $dirty & 1)) {
            if (i2 != 0) {
                isBold3 = false;
            } else {
                isBold3 = z;
            }
            if (i3 != 0) {
                fontSize2 = TextUnitKt.getSp(9);
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(46195100, $dirty, -1, "com.example.sasloopmanager.ThermalReceiptRow (BillingScreen.kt:4581)");
            }
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null);
            Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, centerVertically, $composer2, ((438 >> 3) & 14) | ((438 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer2, fillMaxWidth$default);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int $dirty2 = $dirty;
            int i4 = ((((438 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                function0 = constructor;
                $composer2.createNode(function0);
            } else {
                function0 = constructor;
                $composer2.useNode();
            }
            Composer composer = Updater.constructor-impl($composer2);
            Updater.set-impl(composer, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            boolean isBold4 = isBold3;
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i5 = (i4 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            int i6 = ((438 >> 6) & 112) | 6;
            RowScope rowScope = RowScopeInstance.INSTANCE;
            ComposerKt.sourceInformationMarkerStart($composer2, 577695707, "C4587@284750L38,4588@284797L236,4595@285042L268:BillingScreen.kt#7ez3px");
            SpacerKt.Spacer(RowScope.weight$default(rowScope, Modifier.Companion, 1.0f, false, 2, (Object) null), $composer2, 0);
            long j = Color.Companion.getBlack-0d7_KjU();
            FontWeight.Companion companion = FontWeight.Companion;
            long fontSize4 = fontSize2;
            TextKt.Text-Nvy7gAk(str, PaddingKt.padding-qDBjuR0$default(Modifier.Companion, 0.0f, 0.0f, Dp.constructor-impl(8), 0.0f, 11, (Object) null), j, (TextAutoSize) null, fontSize4, (FontStyle) null, isBold4 ? companion.getBold() : companion.getNormal(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, ($dirty2 & 14) | 432 | (($dirty2 << 3) & 57344), 0, 262056);
            long j2 = Color.Companion.getBlack-0d7_KjU();
            FontWeight.Companion companion2 = FontWeight.Companion;
            TextKt.Text-Nvy7gAk(value, SizeKt.width-3ABfNKs(Modifier.Companion, Dp.constructor-impl(80)), j2, (TextAutoSize) null, fontSize4, (FontStyle) null, isBold4 ? companion2.getBold() : companion2.getNormal(), (FontFamily) null, 0L, (TextDecoration) null, TextAlign.box-impl(TextAlign.Companion.getEnd-e0LSkKk()), 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, (($dirty2 >> 3) & 14) | 432 | (($dirty2 << 3) & 57344), 0, 261032);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
            fontSize3 = fontSize4;
            isBold2 = isBold4;
        } else {
            $composer2.skipToGroupEnd();
            isBold2 = z;
            fontSize3 = fontSize2;
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope(new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda4
                public final Object invoke(Object obj, Object obj2) {
                    return BillingScreenKt.ThermalReceiptRow_JHQioms$lambda$1(label, value, isBold2, fontSize3, $changed, i, (Composer) obj, ((Integer) obj2).intValue());
                }
            });
        }
    }
}
